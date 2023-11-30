import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, Store, User2 } from 'lucide-react';
import { authClient } from '@/service/auth/AuthClient';
import ButtonWithIcon from '@/components/ButtonWithIcon/ButtonWithIcon';
import { Button } from '@/components/ui/button';
import CartInHome from '@/components/CartInHome/CartInHome';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import SearchBar from '@/components/SearchBar/SearchBar';
import NoShop from '@/components/NoShop/NoShop';
import SellerShop from '@/components/SellerShop/SellerShop';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHome } from '@/store/home/useHome';
import { useUser } from '@/store/user/useUser';
import styles from './Navigation.module.scss';

type DropdownItem = {
  title: string;
  href?: string;
  description?: string;
  callback?(): Promise<void>;
};

const Navigation: React.FC = () => {
  const cartInHome = useHome.use.cart_in_home();
  const fetchCartInHome = useHome.use.fetchCartInHome();
  const user_details = useUser.use.user_details();
  const fetchUserDetails = useUser.use.fetchUserDetails();
  const loading_fetch_user_details = useUser.use.loading_fetch_user_details();
  const router = useRouter();

  const components: DropdownItem[] = [
    {
      title: 'My Profile',
      href: '/user?status=Info',
    },
    {
      title: 'My Order',
      href: '/user/order-detail',
    },
    {
      title: 'Wishlist',
      href: '/user/wishlist?status=Wishlist',
    },
    { title: 'MyWallet', href: '/wallet' },
    {
      title: 'Logout',
      async callback() {
        await authClient.logout();
        router.reload();
      },
    },
  ];

  useEffect(() => {
    fetchCartInHome();
    fetchUserDetails();
  }, [fetchCartInHome, fetchUserDetails]);

  return (
    <div className={styles.navigation}>
      {loading_fetch_user_details ? (
        <div className="lg:hidden md:w-[80vw] text-right pb-2"></div>
      ) : (
        <div className="lg:hidden md:w-[80vw] text-right pb-2">
          {user_details.username === '' && (
            <>
              <ButtonWithIcon variant={'link'} href={'/signin'}>
                {'Login'}
              </ButtonWithIcon>
              <ButtonWithIcon
                variant={'link'}
                href={'/register'}
                className="text-muted-foreground"
              >
                {'Register'}
              </ButtonWithIcon>
            </>
          )}
        </div>
      )}
      <div className={styles.navigationContent}>
        <Link href={'/'} className={styles.logo}>
          LilOren
        </Link>
        <SearchBar />
        <NavigationMenu>
          <NavigationMenuList>
            {/* Cart */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <div className="cartWrapper relative w-full">
                  {user_details.username && cartInHome.length !== 0 && (
                    <div className="absolute right-0 w-[18px] h-[18px] pb-[19px] border-white bg-destructive text-white font-bold text-[10px] text-center rounded-full">
                      {cartInHome.length}
                    </div>
                  )}

                  <ButtonWithIcon href="/user/cart" variant={'ghost'}>
                    <ShoppingCart />
                  </ButtonWithIcon>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {user_details.username ? (
                  <CartInHome products={cartInHome} />
                ) : (
                  <EmptyCart />
                )}
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* My Shop */}
            <div className="hidden lg:block">
              {user_details.is_seller ? (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <div className="flex md:flex-row md:gap-3 items-center">
                      <ButtonWithIcon
                        href={`/seller/portal/order`}
                        variant={'ghost'}
                      >
                        <Store />
                        <p className="hidden md:hidden lg:block font-light pl-3">
                          {user_details.shop_name}
                        </p>
                      </ButtonWithIcon>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div
                      className={`flex flex-col w-full lg:w-[400px] justify-center items-center p-3 gap-3`}
                    >
                      <p className={'text-muted-foreground text-center'}>
                        {
                          "Monitor incoming orders and check your shop's progress regularly in one place."
                        }
                      </p>
                      <ButtonWithIcon
                        variant={'default'}
                        href={'/seller/portal/order'}
                      >
                        {'Check my shop'}
                      </ButtonWithIcon>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <div className="flex md:flex-row md:gap-3 items-center">
                      <ButtonWithIcon
                        variant={'ghost'}
                        href={'/seller/onboarding'}
                      >
                        <Store />
                        <p className="hidden md:hidden lg:block font-light pl-3">
                          {'Shop'}
                        </p>
                      </ButtonWithIcon>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div
                      className={`flex flex-col lg:w-[300px] justify-center items-center p-3 gap-3`}
                    >
                      <p className={'text-muted-foreground'}>
                        {"You don't have a shop yet."}
                      </p>
                      <ButtonWithIcon
                        variant={'default'}
                        href={'/seller/onboarding'}
                      >
                        {'Open a free shop'}
                      </ButtonWithIcon>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}
            </div>
            {/* My Shop Mobile */}
            <div className="lg:hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="border-0 rounded-full" variant="outline">
                    <Store />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  {user_details.is_seller ? <SellerShop /> : <NoShop />}
                </DialogContent>
              </Dialog>
            </div>
            {/* My Account */}
            <NavigationMenuItem>
              {/* check if user is logged in or not */}
              {user_details.username !== '' ? (
                <NavigationMenuTrigger>
                  <div className="flex md:flex-row md:gap-3 items-center">
                    <ButtonWithIcon href="/user?status=Info" variant={'ghost'}>
                      <User2 />
                      <p className="hidden md:hidden lg:block font-light pl-3">
                        {user_details.username}
                      </p>
                    </ButtonWithIcon>
                  </div>
                </NavigationMenuTrigger>
              ) : (
                <div className="hidden lg:flex flex-row gap-2 pl-2">
                  <ButtonWithIcon href={'/signin'}>{'Login'}</ButtonWithIcon>
                  <ButtonWithIcon variant={'outline'} href={'/register'}>
                    {'Register'}
                  </ButtonWithIcon>
                </div>
              )}
              <NavigationMenuContent>
                <ul className="hidden sm:grid gap-3 p-6 sm:w-[200px] md:w-[200px] lg:w-[290px] lg:grid-rows-[.75fr_1fr] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                      className="cursor-pointer"
                      onClick={component.callback}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li className="border-b-[1px]">
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          href={href ?? ''}
          {...props}
        >
          <div className="font-medium leading-none whitespace-nowrap overflow-hidden text-ellipsis w-[100px] sm:w-[150px] md:w-[180px] lg:w-[200px] text-[10px] sm:text-[12px] md:text-[14px]">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default Navigation;
