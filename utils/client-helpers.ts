import { OrderItem } from "@/database/models";
import DOMPurify from "isomorphic-dompurify";
import { signOut } from "next-auth/react";

export const getImage = (image: Buffer, image_type: string) => {
  return `data:${image_type};base64,${Buffer.from(image).toString('base64')}`;
};

export const sanitizeAndRenderHTML = (htmlString: string) => {
  const sanitizedHTML = DOMPurify.sanitize(htmlString);
  return { __html: sanitizedHTML };
};

export const capitalizeFirstLetter = (str: string) => {
  return str.replace(/^\w/, (c) => c.toUpperCase());
};

export const getOrderCount = (orderItems: OrderItem[]) => {
  const orders = new Set(orderItems.map(item => item.order_id));
  return orders.size;
};

export const isValidDate = (dateString: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString) && !isNaN(Date.parse(dateString));
};

export const logout = async () => {
  const response = await signOut({ redirect: false, callbackUrl: '/login' });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return response;
};