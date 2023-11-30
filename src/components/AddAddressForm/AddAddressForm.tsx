import React, { useState, ChangeEvent, useEffect, Dispatch } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ToastContent } from 'react-toastify';
import { Utils } from '@/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputWithLabel } from '@/components/InputWithLabel/InputWithLabel';
import SkeletonSelect from '@/components/SkeletonSelect/SkeletonSelect';
import TextAreaWithLabel from '@/components/TextAreaWithLabel/TextAreaWithLabel';
import AsyncButton from '@/components/AsyncButton/AsyncButton';
import { UserAddressClient } from '@/service/userAddress/userAddressClient';
import { DropdownClient } from '@/service/dropdown/DropdownClient';
import { IDropdownData } from '@/service/dropdown/DropdownService';
import { IAddAddressData } from '@/interface/user';
import styles from './AddAddressForm.module.scss';

const RECEIVER_NAME = 'Receiver Name';
const PHONE_NUMBER = 'Phone Number';
const PROVINCE_NAME = 'Province';
const CITY_NAME = 'City';
const SUB_DISTRICT_NAME = 'Sub District';
const SUB_FROM_SUB_DISTRICT_NAME = 'Sub from Sub District';
const PATH_USER_SETTINGS_ADDRESS = '/user/address?status=Address';

interface AddAddressFormProps {
  setShowAddAddressModal?: Dispatch<React.SetStateAction<boolean>>;
}

const AddAddressForm = ({ setShowAddAddressModal }: AddAddressFormProps) => {
  const [provinces, setProvinces] = useState<IDropdownData[]>([]);
  const [cities, setCities] = useState<IDropdownData[]>([]);
  const [loadingFetchProvince, setLoadingFetchProvince] =
    useState<boolean>(false);
  const [loadingFetchCity, setLoadingFetchCity] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const router = useRouter();

  const [addAddressData, setAddAddressData] = useState<IAddAddressData>({
    receiver_name: '',
    receiver_phone_number: '',
    province_id: 0,
    city_id: 0,
    sub_district: '',
    sub_sub_district: '',
    postal_code: '',
    address: '',
  });

  const [isDataValid, setIsDataValid] = useState({
    receiver_name: true,
    receiver_phone_number: true,
    province_id: true,
    city_id: true,
    sub_district: true,
    sub_sub_district: true,
    postal_code: true,
    address: true,
  });

  const fetchProvince = async () => {
    try {
      const response = await DropdownClient.getProvinces();
      const provinces: IDropdownData[] = response.data;
      setProvinces(provinces);
      setLoadingFetchProvince(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Utils.notify(error.message, 'error', 'light');
        setLoadingFetchProvince(false);
      }
    }
  };

  const handleChangeProvince = async (e: string) => {
    setLoadingFetchCity(true);
    setAddAddressData({ ...addAddressData, ['province_id']: parseInt(e) });
    const response = await DropdownClient.getCityByProvinceId(parseInt(e));
    const cities = response.data;
    setCities(cities);
    setLoadingFetchCity(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
  ) => {
    setAddAddressData({ ...addAddressData, [key]: e.target.value });
  };

  const handleChangeCity = (e: string) => {
    setAddAddressData({ ...addAddressData, ['city_id']: parseInt(e) });
  };

  const handleNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key < '0' || e.key > '9') {
      if (e.key !== 'Backspace') {
        e.preventDefault();
      }
    }
  };

  const validateData = (
    key: keyof typeof addAddressData,
    pattern: RegExp,
  ): boolean => {
    if (key === 'receiver_phone_number') {
      if (
        !addAddressData.receiver_phone_number.startsWith('0') ||
        addAddressData.receiver_phone_number.length < 9 ||
        addAddressData.receiver_phone_number.length > 15
      ) {
        setIsDataValid({ ...isDataValid, ['receiver_phone_number']: false });
        return false;
      } else {
        setIsDataValid({ ...isDataValid, ['receiver_phone_number']: true });
        return true;
      }
    }

    if (key === 'postal_code') {
      if (addAddressData.postal_code.length !== 5) {
        setIsDataValid({ ...isDataValid, ['postal_code']: false });
        return false;
      }
    }

    if (
      key === 'receiver_name' ||
      key === 'sub_district' ||
      key === 'sub_sub_district'
    ) {
      if (addAddressData[key].replace(/\s/g, '').length === 0) {
        setIsDataValid({ ...isDataValid, [key]: false });
        return false;
      }
      if (addAddressData[key].startsWith(' ')) {
        setIsDataValid({ ...isDataValid, [key]: false });
        return false;
      }
    }

    const dataRegex = pattern;
    if (!dataRegex.test(addAddressData[key].toString())) {
      setIsDataValid({ ...isDataValid, [key]: false });
      return false;
    }
    setIsDataValid({ ...isDataValid, [key]: true });
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);
    const responseSubmit = await UserAddressClient.create(addAddressData);
    const error = responseSubmit?.error!;
    const message = responseSubmit?.message!;

    if (error) {
      Utils.notify(message as ToastContent, 'error', 'light');
    } else {
      Utils.notify(message as ToastContent, 'success', 'light');
    }
    router.push(PATH_USER_SETTINGS_ADDRESS);
    setLoadingSubmit(false);
    if (setShowAddAddressModal) {
      setShowAddAddressModal(false);
    }
  };

  useEffect(() => {
    setLoadingFetchProvince(true);
    fetchProvince();
  }, []);

  return (
    <form
      className="bg-white overflow-y-auto pb-[100px] lg:pb-2"
      onSubmit={handleSubmit}
    >
      <div className="mb-6 mt-6 px-[14px] flex flex-col gap-4">
        <InputWithLabel
          type="text"
          label={RECEIVER_NAME}
          id="receiver-name"
          labelStyling="font-light"
          value={addAddressData.receiver_name}
          minLength={1}
          maxLength={50}
          onChange={(e) => handleChange(e, 'receiver_name')}
          isValid={isDataValid.receiver_name}
          onBlur={() => validateData('receiver_name', /^[a-zA-Z\s]{3,20}$/)}
          validation="Contains only alphabet with 3-20 chars, no whitespace at the beginning"
          required
        />
        <InputWithLabel
          type="tel"
          label={PHONE_NUMBER}
          id="phone-number"
          labelStyling="font-light"
          value={addAddressData.receiver_phone_number}
          minLength={9}
          maxLength={15}
          onChange={(e) => handleChange(e, 'receiver_phone_number')}
          isValid={isDataValid.receiver_phone_number}
          onKeyDown={(e) => handleNumber(e)}
          onBlur={() => validateData('receiver_phone_number', /^\+?\d{9,15}$/)}
          validation="Phone Number should starts with 0, with min 9 numbers and max 15 numbers"
          required
        />
      </div>
      <div className="divider bg-accent h-2"></div>
      <div className="mb-6 mt-6 px-[14px] flex flex-col gap-4">
        {/* Province */}
        <div className="flex flex-col gap-1">
          <Label className="font-light w-full md:text-base">
            {PROVINCE_NAME}
            <span className="text-primary">{' *'}</span>
          </Label>
          <Select required onValueChange={(e) => handleChangeProvince(e)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a province" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="h-[200px] overflow-y-scroll">
                <SelectLabel>{'Province'}</SelectLabel>
                {provinces.map((province, index) => (
                  <SelectItem
                    key={`key:${province.label} ${index.toString()}`}
                    value={String(province.value)}
                  >
                    {province.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* City */}
        {loadingFetchCity ? (
          <SkeletonSelect label="City" />
        ) : (
          cities.length !== 0 && (
            <div className="flex flex-col gap-1">
              <Label className="font-light w-full md:text-base">
                {CITY_NAME}
                <span className="text-primary">{' *'}</span>
              </Label>
              <Select required onValueChange={(e) => handleChangeCity(e)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="h-[200px] overflow-y-scroll">
                    <SelectLabel>{'City'}</SelectLabel>
                    {cities.map((city, index) => (
                      <SelectItem
                        key={`key:${city.label} ${index.toString()}`}
                        value={String(city.value)}
                      >
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )
        )}
        {addAddressData.city_id !== 0 && (
          <div className="flex lg:flex-row flex-col gap-4 justify-between w-full">
            <div className="flex flex-col lg:flex-col gap-4 w-full">
              <InputWithLabel
                type="text"
                label={SUB_DISTRICT_NAME}
                id="sub-district"
                labelStyling="font-light"
                value={addAddressData.sub_district}
                minLength={3}
                maxLength={50}
                onChange={(e) => handleChange(e, 'sub_district')}
                isValid={isDataValid.sub_district}
                onBlur={() => validateData('sub_district', /^[a-zA-Z\s]+$/)}
                validation="Contains only alphabet with 3-50 chars, no whitespace at the beginning"
                required
              />
              <InputWithLabel
                type="text"
                label={SUB_FROM_SUB_DISTRICT_NAME}
                id="sub-from-sub-district"
                labelStyling="font-light"
                value={addAddressData.sub_sub_district}
                minLength={3}
                maxLength={50}
                onChange={(e) => handleChange(e, 'sub_sub_district')}
                isValid={isDataValid.sub_sub_district}
                onBlur={() => validateData('sub_sub_district', /^[a-zA-Z\s]+$/)}
                validation="Contains only alphabet with 3-50 chars, no whitespace at the beginning"
                required
              />
            </div>
            <div className="flex flex-col lg:flex-col w-full gap-4">
              <InputWithLabel
                type="number"
                label="Zip Code"
                id="zip-code"
                labelStyling="font-light"
                value={addAddressData.postal_code}
                minLength={5}
                maxLength={10}
                onChange={(e) => handleChange(e, 'postal_code')}
                onKeyDown={(e) => handleNumber(e)}
                isValid={isDataValid.postal_code}
                onBlur={() => validateData('postal_code', /^\+?\d{5,15}$/)}
                validation="Zip code only consist of 5 digits"
                required
              />
              <TextAreaWithLabel
                id={'full-address'}
                label={'Full Address'}
                labelStyling="font-light"
                value={addAddressData.address}
                minLength={1}
                maxLength={500}
                onChange={(e) => handleChange(e, 'address')}
                isValid={isDataValid.address}
                onBlur={() => validateData('address', /^[#.0-9a-zA-Z\s,-]+$/)}
                validation="Must not be a blank"
                required
              />
            </div>
          </div>
        )}
      </div>
      {loadingSubmit ? (
        <>
          <div className="hidden lg:flex justify-center">
            <AsyncButton className="w-[100px]" isLoading={true}>
              {'Submit'}
            </AsyncButton>
          </div>
          <div className={styles.button_wrapper}>
            <AsyncButton className="w-full" isLoading={true}>
              {'Submit'}
            </AsyncButton>
          </div>
        </>
      ) : (
        <>
          <div className="hidden lg:flex justify-center">
            <Button
              disabled={
                !Object.values(addAddressData).every((val) => val !== '')
              }
              className="w-[100px]"
              type="submit"
              variant={'default'}
            >
              {'Submit'}
            </Button>
          </div>
          <div className={styles.button_wrapper}>
            <Button
              disabled={
                !Object.values(addAddressData).every((val) => val !== '')
              }
              className="w-full"
              type="submit"
              variant={'default'}
            >
              {'Submit'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default AddAddressForm;
