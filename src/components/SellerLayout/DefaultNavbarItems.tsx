import React from 'react';
import { ClipboardList, Home, Package, Truck } from 'lucide-react';
import { NavItem } from './Sidebar';

export const defaultNavItems: NavItem[] = [
  {
    label: 'Home',
    href: '/seller/portal',
    icon: <Home className="w-6 h-6" />,
  },
  {
    label: 'Product',
    href: '/seller/portal/product',
    icon: <Package className="w-6 h-6" />,
  },
  {
    label: 'Order',
    href: '/seller/portal/order',
    icon: <ClipboardList className="w-6 h-6" />,
  },
  {
    label: 'Shipment',
    href: '/seller/portal/settings/shipment',
    icon: <Truck className="w-6 h-6" />,
  },
];

export default defaultNavItems;
