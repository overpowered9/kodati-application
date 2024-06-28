import dashboardimage from "@/public/sidebar/dashboard.svg";
import ordersimage from "@/public/sidebar/orders.svg";
import profileimage from "@/public/sidebar/profile.svg";
import settingsimage from "@/public/sidebar/settings.svg";
import financeimage from "@/public/sidebar/finance.svg";

export const sidebarButtons = [
  { path: '/dashboard', image: dashboardimage, text: 'Dashboard' },
  { path: '/products', image: dashboardimage, text: 'Products' },
  { path: '/orders', image: ordersimage, text: 'Orders' },
  { path: '/settings', image: settingsimage, text: 'Settings' },
  { path: '/statistics', image: financeimage, text: 'Statistics' },
];

export const adminButtons = [
  { path: '/admin/stores', image: profileimage, text: 'Stores' },
  { path: '/admin/link-products', image: settingsimage, text: 'Link Products' },
  { path: '/admin/linked-products', image: financeimage, text: 'Linked Products' },
];

export const userButtons = [
  { path: '/merchant/link-products', image: settingsimage, text: 'Link Products' },
  { path: '/merchant/templates', image: settingsimage, text: 'Email Templates' },
];