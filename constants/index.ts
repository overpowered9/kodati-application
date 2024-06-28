export const countryCodes = [
  { value: '+966', label: 'Saudi Arabia' },
  { value: '+971', label: 'United Arab Emirates' },
  { value: '+965', label: 'Kuwait' },
  { value: '+968', label: 'Oman' },
  { value: '+973', label: 'Bahrain' },
  { value: '+974', label: 'Qatar' },
];

export const defaultPriceLimit = 370;
export const defaultMaxOrders = 3;
export const pagesToShow = 5;

export const colors = ["#FF6B6B", "#48BB78", "#3182CE", "#F6E05E", "#F56565"];

export const statuses = [
  {
    name: 'Kodati Processing',
    message: 'Your order is pending',
    parentSlug: 'in_progress',
  },
  {
    name: 'Kodati Approval',
    message: 'Your order is confirmed',
    parentSlug: 'in_progress',
  },
  {
    name: 'Kodati Shipped',
    message: 'Your order is shipped',
    parentSlug: 'shipped',
  },
  {
    name: 'Kodati Fulfilled',
    message: 'Your order is fulfilled',
    parentSlug: 'completed',
  },
  {
    name: 'Kodati Failed',
    message: 'Your order failed',
    parentSlug: 'canceled',
  },
];