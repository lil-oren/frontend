import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/store/user/useUser';
import styles from './UserAddressCard.module.scss';
import { useRouter } from 'next/router';
import { IUserAddress } from '@/interface/user';

interface UserAddressCardProps {
  address: IUserAddress;
}

const UserAddressCard = ({ address }: UserAddressCardProps) => {
  const user_default_address = useUser.use.user_default_address();
  const editUserDefaultAddress = useUser.use.editUserDefaultAddress();
  const fetchUserAddresses = useUser.use.fetchUserAddresses();
  const handleMainAddress = (address: IUserAddress) => {
    editUserDefaultAddress(address.id);
    setTimeout(() => {
      fetchUserAddresses();
    }, 200);
  };

  return (
    <div className="address-card-item flex gap-2 hover:cursor-pointer">
      <div className="address-card flex-grow">
        <section
          className={`${styles.card} ${
            user_default_address.id == address.id && styles.selected
          }`}
        >
          <div className={`info-container flex`}>
            <div
              className={`${styles.info_container} ${styles.info} flex-grow`}
            >
              {address.id === user_default_address.id && (
                <div className="bg-muted-foreground w-fit p-2 rounded-sm mb-3">
                  <p className="text-white font-bold text-[12px]">
                    {'Default'}
                  </p>
                </div>
              )}
              <div className="flex flex-col lg:gap-1">
                <p className={`${styles.receiver_name}`}>
                  {address.receiver_name}
                </p>
                <p className={`${styles.phone_number} ${styles.heading}`}>
                  {address.receiver_phone_number}
                </p>
                <p className={`${styles.full_address} ${styles.heading}`}>
                  {address.address}
                </p>
                <p className={`${styles.postal_code} ${styles.heading}`}>
                  {address.postal_code}
                </p>
              </div>
            </div>
            {address.id === user_default_address.id && (
              <div className={`icons`}>
                <Check className={`text-primary`} />
              </div>
            )}
          </div>
          <div className={`action-button ${styles.action_buttons}`}>
            <div className="flex flex-row">
              {user_default_address.id !== address.id && (
                <Button
                  variant={'link'}
                  className="pl-0 pr-2 py-0 h-[20px]"
                  onClick={() => handleMainAddress(address)}
                >
                  {'Set as default address'}
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserAddressCard;
