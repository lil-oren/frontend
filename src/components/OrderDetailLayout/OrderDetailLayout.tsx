import React, { ReactNode } from 'react';
import Tabs from '../Tabs/Tabs';
import Divider from '../Divider/Divider';

const tabsDatas = [
  {
    id: 1,
    label: 'All Order',
    status: '',
    href: '/user/order-detail?page=1',
  },
  {
    id: 2,
    label: 'Waiting for Confirmation',
    status: 'NEW',
    href: '/user/order-detail?status=NEW&page=1',
  },
  {
    id: 3,
    label: 'On Process',
    status: 'PROCESS',
    href: '/user/order-detail?status=PROCESS&page=1',
  },
  {
    id: 4,
    label: 'On Delivery',
    status: 'DELIVER',
    href: '/user/order-detail?status=DELIVER&page=1',
  },
  {
    id: 5,
    label: 'Arrived',
    status: 'ARRIVE',
    href: '/user/order-detail?status=ARRIVE&page=1',
  },
  {
    id: 6,
    label: 'Received',
    status: 'RECEIVE',
    href: '/user/order-detail?status=RECEIVE&page=1',
  },
  {
    id: 7,
    label: 'Cancelled',
    status: 'CANCEL',
    href: '/user/order-detail?status=CANCEL&page=1',
  },
];

interface OrderDetailLayoutProps {
  children: ReactNode;
}

const OrderDetailLayout = ({ children }: OrderDetailLayoutProps) => {
  return (
    <>
      <div
        className={`w-full md:w-[75vw] lg:px-2 lg:pt-5 flex flex-col mx-auto bg-white`}
      >
        <Tabs isSeller={false} datas={tabsDatas} />
        <Divider />
      </div>
      <div>{children}</div>
    </>
  );
};

export default OrderDetailLayout;
