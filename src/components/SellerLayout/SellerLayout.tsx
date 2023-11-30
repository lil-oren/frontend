import { Store } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import Tabs, { IData } from '../Tabs/Tabs';
import Navbar from './Navbar';
import styles from './SellerLayout.module.scss';
import Sidebar from './Sidebar';
import { useUser } from '@/store/user/useUser';
import Footer from '../Footer/Footer';

interface SellerLayoutProps {
  children: ReactNode;
  header: string;
  tabData?: IData[];
}

const SellerLayout = ({ children, header, tabData }: SellerLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user_details = useUser.use.user_details();
  const fetchUserDetails = useUser.use.fetchUserDetails();
  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <div className="grid min-h-screen grid-rows-header bg-zinc-100">
      <div className="bg-white shadow-sm z-10">
        <Navbar onMenuButtonClick={() => setSidebarOpen((prev) => !prev)} />
      </div>
      <div className="grid md:grid-cols-sidebar">
        <div className="shadow-md bg-zinc-50">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>
        <div className="bg-primary-foreground flex flex-col pt-[10px] md:pl-[24px] pb-[24px]">
          <div className={`${styles.shopname} text-muted-foreground pl-[24px]`}>
            <Store className="mr-4 text-muted-foreground" />
            {user_details.username} Shop
          </div>
          {tabData && <Tabs isSeller datas={tabData!} />}
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;
