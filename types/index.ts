export interface QueryParams {
  [key: string]: string | undefined;
};

export enum ViewType {
  Grid,
  List,
}

export interface MerchantInfo {
  avatar: string;
  name: string;
  mobile: string;
  email: string;
}

export interface ZidMerchantInfo extends MerchantInfo {
  id: number;
  store_id: number;
}

export interface WebhookValidationResult {
  isValid: boolean;
  errorResponse?: { error: string, status: number };
}

export interface OAuthResponse {
  access_token: string;
  authorization: string;
  refresh_token: string;
  expires_in: number;
}

export interface EzPinOrder {
  sku: number;
  quantity: number;
  pre_order: boolean;
  price: number;
  delivery_type?: number;
  destination?: string;
  terminal_id?: number;
  terminal_pin?: string;
  reference_code: string;
}

export interface EzPinProduct {
  sku: number;
  item_count: number;
  price: number;
}

export interface ProductsRequest {
  page: number;
  keyword?: string;
}

export interface ZidProductsRequest extends ProductsRequest {
  'Store-Id': number;
}

export interface ProductRequest {
  sku: string;
}

export interface ZidProductRequest extends ProductRequest {
  'Store-Id': number;
  managerToken: string;
}

export interface UpdateStatusRequest {
  orderId: number;
  orderStatus: string;
}

export interface ZidUpdateStatus extends UpdateStatusRequest {
  managerToken: string;
}

export interface EZPINCredentials {
  clientId: string;
  secretKey: string;
}

export interface LikeCardCredentials {
  deviceId: string;
  email: string;
  password: string;
  securityCode: string;
}