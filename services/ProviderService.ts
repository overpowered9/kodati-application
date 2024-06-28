import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import { Provider } from '@/database/models';
import { EZPINCredentials, EzPinOrder, EzPinProduct, LikeCardCredentials } from '@/types';

abstract class ProviderService {
  protected providerAPI: AxiosInstance;
  abstract fetchProducts(categoryId?: string): Promise<any>;
  abstract createOrder(orderRequest: EzPinOrder): Promise<any>;
  abstract fetchCardInformation(referenceCode: string): Promise<any>;
  abstract checkAvailability(product: EzPinProduct): Promise<any>;

  constructor(protected provider: Provider) {
    this.providerAPI = axios.create({
      baseURL: this.provider.base_url,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  protected async performRequest(url: string, method: Method, data?: any, headers?: any) {
    try {
      const config: AxiosRequestConfig = { method, url, headers, data };
      const response = await this.providerAPI.request(config);
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  protected handleRequestError(error: any): never {
    if (axios.isAxiosError(error)) {
      throw new Error(`Request to ${this.provider.name} API failed with status: ${error?.response?.status} and error message: ${JSON.stringify(error?.response?.data)}`);
    }
    throw new Error(`${this.provider.name} API request failed: ${error.message}`);
  }
}

class EZPIN extends ProviderService {
  private accessToken = '';

  constructor(provider: Provider, private readonly credentials: EZPINCredentials) {
    super(provider);
  }

  async init() {
    this.accessToken = await this.fetchAccessToken();
  }

  async fetchAccessToken() {
    const response = await this.performRequest('/auth/token/', 'post', {
      client_id: this.credentials.clientId,
      secret_key: this.credentials.secretKey,
    });
    return response.access;
  }

  async fetchProducts() {
    return await this.performRequest('/catalogs/', 'get', undefined, {
      Authorization: `Bearer ${this.accessToken}`,
    });
  }

  async createOrder(data: EzPinOrder) {
    return await this.performRequest('/orders/', 'post', data, {
      Authorization: `Bearer ${this.accessToken}`,
    });
  }

  async fetchCardInformation(referenceCode: string) {
    return await this.performRequest(`/orders/${referenceCode}/cards/`, 'get', undefined, {
      Authorization: `Bearer ${this.accessToken}`,
    });
  }

  async checkAvailability(data: EzPinProduct) {
    return await this.performRequest(`/catalogs/${data?.sku}/availability/?item_count=${data?.item_count}&price=${data?.price}`, 'get', undefined, {
      Authorization: `Bearer ${this.accessToken}`,
    });
  }
}

class LikeCard extends ProviderService {
  constructor(provider: Provider, private readonly credentials: LikeCardCredentials) {
    super(provider);
  }

  async performRequest(url: string, data?: any) {
    try {
      const formData = new FormData();
      formData.append('deviceId', this.credentials.deviceId);
      formData.append('email', this.credentials.email);
      formData.append('password', this.credentials.password);
      formData.append('securityCode', this.credentials.securityCode);
      formData.append('langId', '1');

      for (const key in data) {
        formData.append(key, data[key]);
      }

      const response = await this.providerAPI.post(url, formData);
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  async fetchCategories() {
    const categories = await this.performRequest('categories');
    return categories.data.filter((category: any) => !category.childs || category.childs.length === 0);
  }

  async fetchProducts(categoryId: string) {
    return await this.performRequest('products', { categoryId });
  }

  async createOrder(data: EzPinOrder) { }

  async fetchCardInformation(referenceCode: string) { }

  async checkAvailability(data: EzPinProduct) { }
}

export async function createProviderService(provider: Provider | null): Promise<ProviderService> {
  if (!provider) {
    throw new Error("Invalid provider found");
  }
  switch (provider.name) {
    case 'EZ PIN':
      const { EZPIN_CLIENT_ID: clientId, EZPIN_SECRET_KEY: secretKey } = process.env;
      if (!clientId || !secretKey) {
        throw new Error('No credentials found for EZPIN provider');
      }
      const instance = new EZPIN(provider, { clientId, secretKey });
      await instance.init();
      return instance;
    case 'Like Card':
      const { LIKECARD_DEVICE_ID: deviceId, LIKECARD_EMAIL: email, LIKECARD_PASSWORD: password, LIKECARD_SECURITY_CODE: securityCode } = process.env;
      if (!deviceId || !email || !password || !securityCode) {
        throw new Error('No credentials found for Like Card provider');
      }
      return new LikeCard(provider, { deviceId, email, password, securityCode });
    default:
      throw new Error(`Invalid provider`);
  }
}