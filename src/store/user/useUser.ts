import { create } from 'zustand';
import { createZusSelector } from '../useSelector';
import { UserAddressClient } from '@/service/userAddress/userAddressClient';
import { IUserAddress, IUserDetails } from '@/interface/user';
import { UserClient } from '@/service/user/userClient';

type State = {
  user_addresses: IUserAddress[];
  loading_ferch_user_addresses: boolean;
  user_default_address: IUserAddress;
  user_details: IUserDetails;
  loading_fetch_user_details: boolean;
};

type Actions = {
  fetchUserAddresses: () => void;
  editUserDefaultAddress: (address_id: number) => void;
  fetchUserDetails: () => void;
};

const useUserBase = create<State & Actions>((set) => ({
  user_addresses: [],
  loading_ferch_user_addresses: false,
  user_default_address: {
    id: 0,
    receiver_name: '',
    address: '',
    postal_code: '',
    receiver_phone_number: '',
  },
  user_selected_address: {
    id: 0,
    receiver_name: '',
    address: '',
    postal_code: '',
    receiver_phone_number: '',
  },
  user_details: {
    user_id: 0,
    username: '',
    is_seller: false,
    is_pin_set: false,
    cart_count: 0,
    profile_picture_url: '',
    email: '',
    shop_name: '',
  },
  loading_fetch_user_details: false,
  fetchUserAddresses: async () => {
    set(() => ({ loading_ferch_user_addresses: true }));
    const response = await UserAddressClient.getUserAddresses();
    set(() => ({ user_addresses: response?.data }));
    set(() => ({ user_default_address: response?.data![0] }));
    set(() => ({ loading_ferch_user_addresses: false }));
  },
  editUserDefaultAddress: async (address_id: number) => {
    await UserAddressClient.editDefaultAddress(address_id);
  },
  fetchUserDetails: async () => {
    set(() => ({
      loading_fetch_user_details: true,
    }));
    const response = await UserClient.getUserDetails();
    if (!response?.error) {
      set(() => ({
        user_details: response?.data,
      }));
    }
    set(() => ({
      loading_fetch_user_details: false,
    }));
  },
}));

export const useUser = createZusSelector(useUserBase);
