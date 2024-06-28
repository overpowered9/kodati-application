import { ProductRequest, ProductsRequest, UpdateStatusRequest, ZidProductRequest, ZidProductsRequest, ZidUpdateStatus } from '@/types';
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';

abstract class StoreService {
  protected storeAPI: AxiosInstance;
  abstract fetchProducts(request: ProductsRequest): Promise<any>;
  abstract fetchProduct(request: ProductRequest): Promise<any>;
  abstract updateStatus(request: UpdateStatusRequest | ZidUpdateStatus): Promise<any>;

  constructor(protected provider: 'salla' | 'zid', protected accessToken: string, protected baseUrl: string) {
    this.storeAPI = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  protected async performRequest(url: string, method: Method, data?: any, headers?: any) {
    try {
      const config: AxiosRequestConfig = { method, url, headers, data };
      const response = await this.storeAPI.request(config);
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  private handleRequestError(error: any): never {
    if (axios.isAxiosError(error)) {
      const errorMessage = error?.response?.data || error.message;
      throw new Error(`Request to ${this.provider} API failed with status: ${error?.response?.status} and error message: ${JSON.stringify(errorMessage)}`);
    }
    throw new Error(`${this.provider} API request failed: ${error.message}`);
  }
}

export class SallaService extends StoreService {
  async fetchProducts(req: ProductsRequest) {
    let endpoint = `/products?per_page=5&page=${req.page}`;
    if (req.keyword) {
      endpoint += `&keyword=${req.keyword}`;
    }
    return await this.performRequest(endpoint, 'get', undefined, {
      Authorization: `Bearer ${this.accessToken}`,
    });
  }

  async fetchProduct(req: ProductRequest) {
    const endpoint = `/products/sku/${req.sku}`;
    return await this.performRequest(endpoint, 'get', undefined, {
      Authorization: `Bearer ${this.accessToken}`,
    });
  }

  async updateStatus(req: UpdateStatusRequest) {
    try {
      return await this.performRequest(`/orders/${req.orderId}/status`, 'post', { slug: req.orderStatus }, {
        Authorization: `Bearer ${this.accessToken}`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async fetchCurrentStatuses() {
    return await this.performRequest('/orders/statuses', 'get', undefined, {
      Authorization: `Bearer ${this.accessToken}`,
    });
  }

  async createCustomStatus(name: string, message: string, parent_id: number) {
    return await this.performRequest('/orders/statuses', 'post', { name, message, parent_id, is_active: true }, {
      Authorization: `Bearer ${this.accessToken}`,
    });
  }

  async createCustomStatuses(statuses: { name: string, message: string, parentSlug: string }[]) {
    try {
      const currentStatuses = await this.fetchCurrentStatuses();
      statuses.forEach(async (status) => {
        const { name, message, parentSlug } = status;
        const parentStatus = currentStatuses?.data.find((status: any) => status.slug === parentSlug);

        if (!parentStatus) {
          throw new Error(`Parent status with slug ${parentSlug} not found`);
        }

        const parentId = parentStatus?.parent?.id ?? parentStatus?.id;
        await this.createCustomStatus(name, message, parentId);
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export class ZidService extends StoreService {
  async fetchProducts(req: ZidProductsRequest) {
    let endpoint = `/products?page_size=5&page=${req.page}`;
    if (req.keyword) {
      endpoint += `&name=${req.keyword}`;
    }
    return await this.performRequest(endpoint, 'get', undefined, {
      'Store-Id': req['Store-Id'],
    });
  }

  async fetchProduct(req: ZidProductRequest) {
    const endpoint = `/products/${req.sku}`;
    return await this.performRequest(endpoint, 'get', undefined, {
      Authorization: `Bearer ${this.accessToken}`,
      Role: 'Manager',
      'Store-Id': req['Store-Id'],
      'Access-Token': req.managerToken,
    });
  }

  async updateStatus(req: ZidUpdateStatus) {
    try {
      const formData = new FormData();
      formData.append('order_status', req.orderStatus);
      return await this.performRequest(`/managers/store/orders/${req.orderId}/change-order-status`, 'post', formData, {
        Authorization: `Bearer ${this.accessToken}`,
        'X-Manager-Token': req.managerToken,
        'Content-Type': 'multipart/form-data',
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export function createStoreService(provider: 'salla' | 'zid' | null, accessToken: string | null): StoreService {
  if (!provider || !accessToken) {
    throw new Error('Missing provider or access token');
  }
  const { SALLA_BASE_URL, ZID_BASE_URL } = process.env;
  if (!SALLA_BASE_URL || !ZID_BASE_URL) {
    throw new Error('Missing environment variable(s)');
  }
  switch (provider) {
    case 'salla':
      return new SallaService(provider, accessToken, SALLA_BASE_URL);
    case 'zid':
      return new ZidService(provider, accessToken, ZID_BASE_URL);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}