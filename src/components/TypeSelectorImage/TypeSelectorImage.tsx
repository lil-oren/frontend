import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { IVariantGroup, IVariantType } from '@/interface/productPage';

interface ITypeSelectorImageProps {
  variant_group: IVariantGroup;
  chosenType: IVariantType;
  setChosenType: Dispatch<SetStateAction<IVariantType>>;
}

const TypeSelectorImage = ({
  variant_group,
  chosenType,
  setChosenType,
}: ITypeSelectorImageProps) => {
  return (
    <div className="flex flex-col items-baseline w-full">
      <p className="text-base font-semibold sm:text-lg lg:text-xl">
        {`${variant_group.group_name}:`}{' '}
        <span className="font-light">{chosenType.type_name}</span>
      </p>
      <ScrollArea className="max-w-full mt-2">
        <div className="flex space-x-5 py-1 xl:grid xl:space-x-0 xl:grid-cols-5 xl:gap-3">
          {variant_group.variant_types.map((type, index) => (
            <button
              key={index}
              className={`min-w-fit flex items-center gap-1 p-0.5 rounded-md border-2 cursor-pointer group duration-300 lg:hover:border-primary lg:hover:opacity-100 lg:hover:bg-[#FEF6F0] ${
                type.type_id === chosenType.type_id
                  ? 'border-primary bg-[#FEF6F0]'
                  : 'border-gray-300 bg-transparent'
              }`}
              onClick={() => setChosenType(type)}
            >
              <Image
                key={index}
                src={
                  'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//92/MTA-5070654/dc_dc_trase_tx_m_shoe_adys300126-bgm_black-gum_full02_g0b376j9.jpg'
                }
                alt={`Product variant ${chosenType.type_name}`}
                width={40}
                height={40}
                style={{ objectFit: 'fill' }}
                className="aspect-square"
              />
              <p
                className={`duration-300 lg:group-hover:text-primary ${
                  type.type_id === chosenType.type_id
                    ? 'text-primary'
                    : 'text-gray-500'
                }`}
              >
                {chosenType.type_name}
              </p>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default TypeSelectorImage;
