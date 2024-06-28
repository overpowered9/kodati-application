import { User } from '@/database/models';
import { MerchantInfo, WebhookValidationResult, ZidMerchantInfo } from '@/types';
import axios, { isAxiosError } from 'axios';
import crypto from 'crypto';
import moment from 'moment';

export const fetchMerchant = async (accessToken: string, provider: 'salla' | 'zid', managerToken?: string): Promise<MerchantInfo | ZidMerchantInfo> => {
  const { SALLA_BASE_URL, ZID_BASE_URL } = process.env;
  if (!SALLA_BASE_URL || !ZID_BASE_URL) {
    throw new Error('Missing environment variable(s)');
  }

  let endpoint = '';
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
    ...(provider === 'zid' && { 'X-Manager-Token': managerToken }),
  };

  if (provider === 'salla') {
    endpoint = `${SALLA_BASE_URL}/oauth2/user/info`;
  } else if (provider === 'zid') {
    endpoint = `${ZID_BASE_URL}/managers/account/profile`;
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }

  try {
    const response = await axios.get(endpoint, { headers });
    const data = response.data;

    if (provider === 'salla') {
      const { merchant, mobile, email } = data?.data;
      return {
        avatar: merchant?.avatar,
        name: merchant?.name,
        mobile,
        email,
      };
    } else if (provider === 'zid') {
      const { user } = data;
      return {
        avatar: user?.store?.logo ?? '',
        name: user?.name,
        mobile: user?.mobile,
        email: user?.email,
        id: user?.id,
        store_id: user?.store?.id,
      };
    } else {
      throw new Error(`Invalid provider: ${provider}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Request to fetch merchant info failed with status: ${error?.response?.status} and error message: ${JSON.stringify(error?.response?.data)}`);
    } else {
      throw new Error(`Error fetching merchant info: ${error}`);
    }
  }
};

export const convertUnixTimestampToMySQLDateTime = (timestamp: number, type: 'unix' | 'seconds') => {
  if (type === 'unix') {
    return moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');
  } else if (type === 'seconds') {
    const currentTimeInSeconds = moment().unix();
    return moment.unix(timestamp + currentTimeInSeconds).format('YYYY-MM-DD HH:mm:ss');
  }
}

const isImage = (file: File): boolean => {
  return file.type.startsWith('image/');
}

export const validateFields = (title: string, description: string, price: number, file: File | null, categories: string, regions: string): string | null => {
  if (!title || !description || isNaN(price) || !categories || !regions || price <= 0) {
    return "Invalid data. Title, description, price, regions and categories are required and price must be greater than zero.";
  }

  if (file) {
    if (!isImage(file)) {
      return "Only image files are allowed.";
    }
  }

  return null; // No validation errors
}

export const validateCategories = (name: string, file: File | null): string | null => {
  if (!name) {
    return "Invalid data. Category name is required.";
  }

  if (file) {
    if (!isImage(file)) {
      return "Only image files are allowed.";
    }
  }

  return null; // No validation errors
}

export const validateRegions = (name: string, code: string): string | null => {
  if (!name || !code) {
    return "Invalid data. Both name and code are required.";
  }

  return null; // No validation errors
}

export const validateSallaWebhook = async (requestHMAC: string | null, body: any): Promise<WebhookValidationResult> => {
  try {
    const secret = process.env.WEBHOOK_SECRET;

    if (!secret) {
      console.error('Missing WEBHOOK_SECRET in environment variables');
      return { isValid: false, errorResponse: { error: 'Internal Server Error', status: 500 } };
    }

    const computedHMAC = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');
    const signatureMatches = requestHMAC === computedHMAC;

    if (!signatureMatches) {
      console.error('Invalid signature');
      return { isValid: false, errorResponse: { error: 'Unauthorized', status: 401 } };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error while validating Salla's webhook:", error);
    return { isValid: false, errorResponse: { error: 'Internal Server Error', status: 500 } };
  }
};

export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const generateToken = (length: number): string => {
  return crypto.randomBytes(length).toString('hex');
}

export const updateToken = async (merchantId: number) => {
  try {
    const user = await User.findByPk(merchantId, { attributes: ['id', 'refresh_token', 'access_token_expired', 'provider'] });
    if (!user || !user.access_token_expired || !user.refresh_token || !user.provider) {
      return false;
    }
    const isExpired = moment(user.access_token_expired) <= moment();
    if (!isExpired) {
      return true;
    }
    if (user.provider === 'salla') {
      const response = await updateSallaToken(user.refresh_token);
      const access_token_expired = convertUnixTimestampToMySQLDateTime(response?.expires_in, 'seconds');
      const access_token_created = moment().format('YYYY-MM-DD HH:mm:ss');
      const updateFields = {
        access_token: response?.access_token,
        refresh_token: response?.refresh_token,
        access_token_expired,
        access_token_created,
      };
      await user.update(updateFields);
      return true;
    } else if (user.provider === 'zid') {
      const response = await updateZidToken(user.refresh_token);
      const access_token_expired = convertUnixTimestampToMySQLDateTime(response?.expires_in, 'seconds');
      const access_token_created = moment().format('YYYY-MM-DD HH:mm:ss');
      const updateFields = {
        access_token: response?.authorization,
        refresh_token: response?.refresh_token,
        access_token_expired,
        access_token_created,
        manager_token: response?.access_token,
      };
      await user.update(updateFields);
      return true;
    } else {
      console.error(`Unsupported provider: ${user.provider}`);
      return false;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Request to Salla API failed with status: ${error?.response?.status} and error message: ${JSON.stringify(error?.response?.data)}`);
    } else {
      console.error(error);
    }
    return false;
  }
};

const getAuthConfig = (provider: 'salla' | 'zid') => {
  if (provider === 'salla') {
    const { SALLA_CLIENT_ID: client_id, SALLA_CLIENT_SECRET: client_secret, SALLA_AUTH_URL: authUrl } = process.env;
    if (!client_id || !client_secret || !authUrl) {
      throw new Error('Missing environment variable(s)');
    }
    return { client_id, client_secret, authUrl };
  } else if (provider === 'zid') {
    const { ZID_CLIENT_ID: client_id, ZID_CLIENT_SECRET: client_secret, ZID_AUTH_URL: authUrl, ZID_REDIRECT_URI: redirect_uri } = process.env;
    if (!client_id || !client_secret || !authUrl || !redirect_uri) {
      throw new Error('Missing environment variable(s)');
    }
    return { client_id, client_secret, authUrl, redirect_uri };
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }
};

export const updateSallaToken = async (refreshToken: string) => {
  try {
    const { client_id, client_secret, authUrl } = getAuthConfig('salla');
    const payload = {
      client_id,
      client_secret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };
    const response = await axios.post(`${authUrl}/token`, new URLSearchParams(Object.entries(payload)), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Request to Salla for refreshing access token failed with status: ${error?.response?.status} and error message: ${JSON.stringify(error?.response?.data)}`);
    } else {
      throw new Error(`Error refreshing access: ${error}`);
    }
  }
};

export const updateZidToken = async (refreshToken: string) => {
  try {
    const { client_id, client_secret, authUrl, redirect_uri } = getAuthConfig('zid');
    const payload = {
      client_id,
      client_secret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      redirect_uri
    };
    const response = await axios.post(`${authUrl}/oauth/token`, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Request to Zid for refreshing access token failed with status: ${error?.response?.status} and error message: ${JSON.stringify(error?.response?.data)}`);
    } else {
      throw new Error(`Error refreshing access: ${error}`);
    }
  }
};
