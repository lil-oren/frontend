import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ProductVariant from '@/components/ProductVariant/ProductVariant';
import {
  IProductVariant,
  IIsProductVariantValid,
  IVariantGroup,
  IVariantDefinition,
  IProductInformation,
  IProductCategory,
  IProductDetailForEdit,
} from '@/interface/addProduct';
import PhotosArray from '@/components/PhotosArray/PhotosArray';
import { Textarea } from '@/components/ui/textarea';
import styles from './ProductForm.module.scss';
import { Utils } from '@/utils';
import axiosInstance from '@/lib/axiosInstance';
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
import imageUploadder from '@/lib/imageUploadder';
import { useRouter } from 'next/router';
import urlToFileConverter from '@/lib/urlToFileConverter';
import DotsLoading from '../DotsLoading/DotsLoading';

const maxPhoto: number = 6;
const maxNameLength: number = 255;
const maxDescLength: number = 3000;
const minDescLength: number = 20;
const maxOptLength: number = 3;

interface ProductFormProps {
  isEdit: boolean;
  productToEdit: IProductDetailForEdit | undefined;
}

const ProductForm = ({ isEdit = false, productToEdit }: ProductFormProps) => {
  const router = useRouter();
  const [isInitialStateLoading, setIsInitialStateLoading] =
    useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [productInformation, setProductInformation] =
    useState<IProductInformation>({
      product_name: '',
      product_desc: '',
      weight: '',
    });
  const [isProductInformationValid, setIsProductInformationValid] = useState({
    product_name: true,
    product_desc: true,
    weight: true,
  });

  function handleChangeProductInfoString(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof IProductInformation,
  ) {
    const { value } = e.target;
    if (key === 'product_name' && value.length > maxNameLength) return;
    if (key === 'product_desc' && value.length > maxDescLength) return;
    if (/^\s+$/.test(value) || value === '') {
      setProductInformation({ ...productInformation, [key]: '' });
      return;
    } else {
      setProductInformation({ ...productInformation, [key]: value });
    }
  }

  function handleChangeWeight(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === '') {
      setProductInformation({ ...productInformation, weight: e.target.value });
      return;
    }
    const inputValue = parseInt(e.target.value);
    if (isNaN(inputValue) || inputValue < 0) {
      setProductInformation({ ...productInformation, weight: 0 });
    } else {
      setProductInformation({ ...productInformation, weight: inputValue });
    }
  }

  function handleNumKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (['e', 'E', '+', '-', ' '].includes(e.key)) {
      e.preventDefault();
    }
  }

  function validateOnBlur(key: keyof IProductInformation): boolean | undefined {
    if (key === 'product_name' && productInformation.product_name === '') {
      setIsProductInformationValid({
        ...isProductInformationValid,
        [key]: false,
      });
      return false;
    } else if (
      key === 'product_name' &&
      productInformation.product_name !== ''
    ) {
      setIsProductInformationValid({
        ...isProductInformationValid,
        [key]: true,
      });
      return true;
    }

    if (
      key === 'weight' &&
      (productInformation.weight === '' || productInformation.weight < 1)
    ) {
      setIsProductInformationValid({
        ...isProductInformationValid,
        [key]: false,
      });
      return false;
    } else if (key === 'weight' && (productInformation.weight as number) >= 1) {
      setIsProductInformationValid({
        ...isProductInformationValid,
        [key]: true,
      });
      return true;
    }

    if (
      key === 'product_desc' &&
      productInformation.product_desc.length < minDescLength
    ) {
      setIsProductInformationValid({
        ...isProductInformationValid,
        [key]: false,
      });
      return false;
    } else if (
      key === 'product_desc' &&
      productInformation.product_desc.length >= minDescLength
    ) {
      setIsProductInformationValid({
        ...isProductInformationValid,
        [key]: true,
      });
      return true;
    }
  }

  // ADD PHOTO
  const [remainingPhotos, setRemainingPhotos] = useState<number>(maxPhoto);
  const [tempProductPhotos, setTempProductPhotos] = useState<File[]>([]);

  // PRODUCT CATEGORY
  const [category1, setCategory1] = useState<string | undefined>(undefined);
  const [category2, setCategory2] = useState<string | undefined>(undefined);
  const [category1Options, setCatgeory1Options] = useState<IProductCategory[]>(
    [],
  );
  const [category2Options, setCatgeory2Options] = useState<IProductCategory[]>(
    [],
  );
  const [isCatFetchLoading, setIsCatFetchLoading] = useState<boolean>(false);
  const [isCategoryValid, setIsCategoryValid] = useState<boolean>(true);

  async function getCategory1Options() {
    try {
      const response = await axiosInstance(
        `/dropdowns/products/top-categories`,
      );
      setCatgeory1Options(response.data.data);
    } catch (error) {
      Utils.handleGeneralError(error);
      console.error(error);
    }
  }

  async function handleCategory1Change(value: string) {
    setIsCatFetchLoading(true);
    setCategory2(undefined);
    try {
      const response = await axiosInstance(
        `/dropdowns/products/child-category?parent_id=${value}`,
      );
      setCatgeory2Options(response.data.data);
      setCategory1(value);
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsCatFetchLoading(false);
    }
  }

  function handleCategory2Change(value: string) {
    setCategory2(value);
    setIsCategoryValid(true);
  }

  useEffect(() => {
    getCategory1Options();
  }, []);

  // PRODUCT VARIANT -- START
  const [isVariantActive, setIsVariantActive] = useState<boolean>(false);
  const [noVarPrice, setNoVarPrice] = useState<number | ''>(0);
  const [noVarStock, setNoVarStock] = useState<number | ''>(0);
  const [isNoVarValid, setIsNoVarValid] = useState<{
    price: boolean;
    stock: boolean;
  }>({
    price: true,
    stock: true,
  });
  const [variants, setVariants] = useState<IProductVariant[]>([
    { variant_name: '', options: [undefined] },
  ]);
  const [isVariantsValid, setIsVariantsValid] = useState<
    IIsProductVariantValid[]
  >([{ variant_name: true, options: [true] }]);
  const [price, setPrice] = useState<(number | '')[][]>(
    new Array(maxOptLength).fill(new Array(maxOptLength).fill(0)),
  );
  const [stocks, setStocks] = useState<(number | '')[][]>(
    new Array(maxOptLength).fill(new Array(maxOptLength).fill(0)),
  );
  const [isPriceValid, setIsPriceValid] = useState<boolean[][]>(
    new Array(maxOptLength).fill(new Array(maxOptLength).fill(true)),
  );
  const [isStockValid, setIsStockValid] = useState<boolean[][]>(
    new Array(maxOptLength).fill(new Array(maxOptLength).fill(true)),
  );
  function checkIfOptDuplicate(
    index: number | undefined,
    biggerIndex: number,
  ): boolean {
    let isDuplicate = false;
    const duplicateArray: number[] = [];
    const options: (string | undefined)[] = [...variants[biggerIndex].options];
    const newIsVariantsValid = [...isVariantsValid];
    if (index !== undefined) {
      for (let i = 0; i < options.length; i++) {
        for (let j = i + 1; j < options.length; j++) {
          if (
            options[i] !== undefined &&
            options[j] !== undefined &&
            options[i] !== '' &&
            options[j] !== '' &&
            options[i]?.toLowerCase().trim() ===
              options[j]?.toLowerCase().trim()
          ) {
            isDuplicate = true;
            duplicateArray.push(i);
            duplicateArray.push(j);
          }
        }
      }
      if (isDuplicate && duplicateArray.length !== 0) {
        duplicateArray.forEach((item) => {
          newIsVariantsValid[biggerIndex].options[item] = false;
        });
      } else {
        options.forEach((item, itemIndex) => {
          if (itemIndex !== index && item !== '') {
            newIsVariantsValid[biggerIndex].options[itemIndex] = true;
          }
        });
      }
      setIsVariantsValid(newIsVariantsValid);
    } else {
      for (let i = 0; i < options.length; i++) {
        for (let j = i + 1; j < options.length; j++) {
          if (
            options[i] !== undefined &&
            options !== undefined &&
            options[i] !== '' &&
            options[j] !== '' &&
            options[i]?.toLowerCase().trim() ===
              options[j]?.toLowerCase().trim()
          ) {
            isDuplicate = true;
            duplicateArray.push(i);
            duplicateArray.push(j);
          }
        }
        if (isDuplicate && duplicateArray.length !== 0) {
          duplicateArray.forEach((item) => {
            newIsVariantsValid[biggerIndex].options[item] = false;
          });
        } else {
          options.forEach((item, itemIndex) => {
            if (item !== '') {
              newIsVariantsValid[biggerIndex].options[itemIndex] = true;
            }
          });
        }
        setIsVariantsValid(newIsVariantsValid);
      }
    }
    return isDuplicate;
  }
  function checkIfNameDuplicate(biggerIndex: number | undefined): boolean {
    let isDuplicate = false;
    if (variants.length === 1) {
      return isDuplicate;
    }
    const newIsVariantsValid = [...isVariantsValid];
    if (
      variants[0].variant_name !== '' &&
      variants[1].variant_name !== '' &&
      variants[0].variant_name.toLowerCase().trim() ===
        variants[1].variant_name.toLowerCase().trim()
    ) {
      isDuplicate = true;
      newIsVariantsValid[0].variant_name = false;
      newIsVariantsValid[1].variant_name = false;
      setIsVariantsValid(newIsVariantsValid);
    } else {
      if (biggerIndex !== undefined) {
        newIsVariantsValid.forEach((_, index) => {
          if (index !== biggerIndex) {
            newIsVariantsValid[index].variant_name = true;
          }
        });
      } else {
        newIsVariantsValid.forEach((_, index) => {
          newIsVariantsValid[index].variant_name = true;
        });
      }
      setIsVariantsValid(newIsVariantsValid);
    }
    return isDuplicate;
  }
  function validateNoVar(): boolean {
    let isContinue: boolean = true;
    if (noVarPrice === '' || noVarPrice < 99) {
      isContinue = false;
      setIsNoVarValid({ ...isNoVarValid, price: false });
    }
    if (noVarStock === '' || noVarStock < 0) {
      isContinue = false;
      setIsNoVarValid({ ...isNoVarValid, stock: false });
    }
    return isContinue;
  }
  function validateVar(): boolean {
    let isContinue: boolean = true;
    const newIsVariantsValid = [...isVariantsValid];
    if (checkIfNameDuplicate(undefined)) {
      isContinue = false;
    }
    for (let i = 0; i < variants.length; i++) {
      if (variants[i].variant_name === '') {
        isContinue = false;
        newIsVariantsValid[i].variant_name = false;
      }
      if (checkIfOptDuplicate(undefined, i)) {
        isContinue = false;
      }
      for (let j = 0; j < variants[i].options.length; j++) {
        if (
          (variants[i].options.length === 1 &&
            variants[i].options[j] === undefined) ||
          variants[i].options[j] === ''
        ) {
          isContinue = false;
          newIsVariantsValid[i].options[j] = false;
        }
      }
    }
    setIsVariantsValid(newIsVariantsValid);
    if (variants.length === 1) {
      const newIsPriceValid = [...isPriceValid];
      const newIsStockValid = [...isStockValid];
      for (let i = 0; i < variants[0].options.length; i++) {
        if (
          variants[0].options[i] !== undefined &&
          (price[i][0] === '' || (price[i][0] as number) < 99)
        ) {
          isContinue = false;
          const newSmallArray = [...newIsPriceValid[i]];
          newSmallArray[0] = false;
          newIsPriceValid[i] = newSmallArray;
        }
        if (
          variants[0].options[i] !== undefined &&
          (stocks[i][0] === '' || (stocks[i][0] as number) < 0)
        ) {
          isContinue = false;
          const newSmallArray = [...newIsStockValid[i]];
          newSmallArray[0] = false;
          newIsStockValid[i] = newSmallArray;
        }
      }
      setIsPriceValid(newIsPriceValid);
      setIsStockValid(newIsStockValid);
    }
    if (variants.length === 2) {
      const newIsPriceValid = [...isPriceValid];
      const newIsStockValid = [...isStockValid];
      for (let i = 0; i < variants[0].options.length; i++) {
        for (let j = 0; j < variants[1].options.length; j++) {
          if (
            variants[0].options[i] !== undefined &&
            variants[1].options[j] !== undefined &&
            (price[i][j] === '' || (price[i][j] as number) < 99)
          ) {
            isContinue = false;
            const newSmallArray = [...newIsPriceValid[i]];
            newSmallArray[j] = false;
            newIsPriceValid[i] = newSmallArray;
          }
          if (
            variants[0].options[i] !== undefined &&
            variants[1].options[j] !== undefined &&
            (stocks[i][j] === '' || (stocks[i][j] as number) < 0)
          ) {
            isContinue = false;
            const newSmallArray = [...newIsStockValid[i]];
            newSmallArray[j] = false;
            newIsStockValid[i] = newSmallArray;
          }
        }
      }
      setIsPriceValid(newIsPriceValid);
      setIsStockValid(newIsStockValid);
    }
    return isContinue;
  }
  function validateAll(): boolean {
    let isContinue: boolean = true;
    if (!isVariantActive && !validateNoVar()) {
      isContinue = false;
    }
    if (isVariantActive && !validateVar()) {
      isContinue = false;
    }
    return isContinue;
  }
  function validateRequestBody(): boolean {
    let isContinue: boolean = true;
    const newIsProductInformationValid = { ...isProductInformationValid };
    if (productInformation.product_name === '') {
      newIsProductInformationValid.product_name = false;
      isContinue = false;
    }
    if (productInformation.weight === '' || productInformation.weight < 1) {
      newIsProductInformationValid.weight = false;
      isContinue = false;
    }
    if (productInformation.product_desc.length < minDescLength) {
      newIsProductInformationValid.product_desc = false;
      isContinue = false;
    }
    setIsProductInformationValid(newIsProductInformationValid);
    if (tempProductPhotos.length === 0) {
      Utils.notify('Product must have at least 1 photo', 'warning', 'colored');
      isContinue = false;
    }
    if (category1 === undefined || category2 === undefined) {
      setIsCategoryValid(false);
      isContinue = false;
    }
    if (!validateAll()) {
      isContinue = false;
    }
    return isContinue;
  }
  async function createRequestBody() {
    const imageUrl = [];
    for (let i = 0; i < tempProductPhotos.length; i++) {
      const response = await imageUploadder(tempProductPhotos[i]);
      imageUrl.push(response);
    }

    if (!isVariantActive) {
      const reqBody = {
        product_id: productToEdit?.id,
        product_name: productInformation.product_name,
        description: productInformation.product_desc,
        weight: productInformation.weight,
        image_url: imageUrl,
        is_variant: isVariantActive,
        product_category_id: {
          level_1: parseInt(category1!),
          level_2: parseInt(category2!),
        },
        variants: [
          {
            price: noVarPrice as number,
            stock: noVarStock as number,
          },
        ],
      };
      return reqBody;
    }
    if (variants.length === 1) {
      const variantTypes1: string[] = [];
      for (let i = 0; i < variants[0].options.length; i++) {
        if (variants[0].options[i] !== undefined) {
          variantTypes1.push(variants[0].options[i] as string);
        }
      }
      const variant_definition: IVariantDefinition = {
        variant_group_1: {
          name: variants[0].variant_name,
          variant_types: variantTypes1,
        },
      };
      const variant_group: IVariantGroup[] = [];
      for (let i = 0; i < variants[0].options.length; i++) {
        if (variants[0].options[i] !== undefined) {
          const variantGroup: IVariantGroup = {
            variant_type1: variants[0].options[i] as string,
            price: price[i][0] as number,
            stock: stocks[i][0] as number,
          };
          variant_group.push(variantGroup);
        }
      }
      const reqBody = {
        product_id: productToEdit?.id,
        product_name: productInformation.product_name,
        description: productInformation.product_desc,
        weight: productInformation.weight,
        image_url: imageUrl,
        is_variant: isVariantActive,
        product_category_id: {
          level_1: parseInt(category1!),
          level_2: parseInt(category2!),
        },
        variant_definition: variant_definition,
        variants: variant_group,
      };
      return reqBody;
    }
    if (variants.length === 2) {
      const variantTypes1: string[] = [];
      for (let i = 0; i < variants[0].options.length; i++) {
        if (variants[0].options[i] !== undefined) {
          variantTypes1.push(variants[0].options[i] as string);
        }
      }
      const variantTypes2: string[] = [];
      for (let i = 0; i < variants[1].options.length; i++) {
        if (variants[1].options[i] !== undefined) {
          variantTypes2.push(variants[1].options[i] as string);
        }
      }
      const variant_definition: IVariantDefinition = {
        variant_group_1: {
          name: variants[0].variant_name,
          variant_types: variantTypes1,
        },
        variant_group_2: {
          name: variants[1].variant_name,
          variant_types: variantTypes2,
        },
      };
      const variant_group: IVariantGroup[] = [];
      for (let i = 0; i < variants[0].options.length; i++) {
        for (let j = 0; j < variants[1].options.length; j++) {
          if (
            variants[0].options[i] !== undefined &&
            variants[1].options[j] !== undefined
          ) {
            const variantGroup: IVariantGroup = {
              variant_type1: variants[0].options[i] as string,
              variant_type2: variants[1].options[j] as string,
              price: price[i][j] as number,
              stock: stocks[i][j] as number,
            };
            variant_group.push(variantGroup);
          }
        }
      }
      const reqBody = {
        product_id: productToEdit?.id,
        product_name: productInformation.product_name,
        description: productInformation.product_desc,
        weight: productInformation.weight,
        image_url: imageUrl,
        is_variant: isVariantActive,
        product_category_id: {
          level_1: parseInt(category1!),
          level_2: parseInt(category2!),
        },
        variant_definition: variant_definition,
        variants: variant_group,
      };
      return reqBody;
    }
  }
  async function postFormBody() {
    setIsPageLoading(true);
    if (!validateRequestBody()) {
      setIsPageLoading(false);
      return false;
    }

    const reqBody = await createRequestBody();

    if (reqBody === undefined) {
      return;
    }

    try {
      if (isEdit) {
        await axiosInstance.put(`/merchant/product`, reqBody);
      } else {
        await axiosInstance.post(`/merchant/product`, reqBody);
      }
      if (isEdit) {
        Utils.notify('Successfully edit the product', 'success', 'colored');
      } else {
        Utils.notify('Successfully added the product', 'success', 'colored');
      }
      router.push('/seller/portal/product');
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsPageLoading(false);
    }
  }

  async function setInitialStateForEdit() {
    if (productToEdit === undefined) return;
    setIsInitialStateLoading(true);
    try {
      const newProductInformation: IProductInformation = {
        product_name: productToEdit.product_name,
        product_desc: productToEdit.description,
        weight: productToEdit.weight,
      };
      setProductInformation(newProductInformation);
      const newTempPhotos: File[] = [];
      let photoLimit = maxPhoto;
      for (let i = 0; i < productToEdit.media.length; i++) {
        const newFile = await urlToFileConverter(
          productToEdit.media[i].media_url,
          productToEdit.product_name,
        );
        photoLimit--;
        newTempPhotos.push(newFile!);
      }
      setTempProductPhotos(newTempPhotos);
      setRemainingPhotos(photoLimit);
      await handleCategory1Change(
        productToEdit.category[0].category_id.toString(),
      );
      setCategory2(productToEdit.category[1].category_id.toString());
      if (
        productToEdit.variant_group[0].variant_group_name === 'default' &&
        productToEdit.variant_group[1].variant_group_name === 'default'
      ) {
        setNoVarPrice(productToEdit.variant_detail[0].price);
        setNoVarStock(productToEdit.variant_detail[0].stock);
      } else {
        setIsVariantActive(true);
        if (
          productToEdit.variant_group[0].variant_group_name !== 'default' &&
          productToEdit.variant_group[1].variant_group_name === 'default'
        ) {
          const newVariants: IProductVariant[] = [];
          const isNewVariantsValid: IIsProductVariantValid[] = [];
          const isNewVariantValid: IIsProductVariantValid = {
            variant_name: true,
            options: [],
          };
          const newVariant: IProductVariant = {
            variant_name: productToEdit.variant_group[0].variant_group_name,
            options: [],
          };
          const newPrice = new Array(maxOptLength).fill(
            new Array(maxOptLength).fill(0),
          );
          const newStock = new Array(maxOptLength).fill(
            new Array(maxOptLength).fill(0),
          );
          productToEdit.variant_detail.forEach((item, index) => {
            newVariant.options.push(item.variant_type1_name);
            isNewVariantValid.options.push(true);

            const newSmallPrice = [...newPrice[index]];
            newSmallPrice[0] = item.price;
            newPrice[index] = newSmallPrice;

            const newSmallStock = [...newStock[index]];
            newSmallStock[0] = item.stock;
            newStock[index] = newSmallStock;
          });
          newVariants.push(newVariant);
          isNewVariantsValid.push(isNewVariantValid);
          setVariants(newVariants);
          setIsVariantsValid(isNewVariantsValid);
          setPrice(newPrice);
          setStocks(newStock);
        } else {
          const newVariants: IProductVariant[] = [];
          const isNewVariantsValid: IIsProductVariantValid[] = [];
          const newVariant1: IProductVariant = {
            variant_name: productToEdit.variant_group[0].variant_group_name,
            options: [],
          };
          const isNewVariantValid1: IIsProductVariantValid = {
            variant_name: true,
            options: [],
          };
          const newVariant2: IProductVariant = {
            variant_name: productToEdit.variant_group[1].variant_group_name,
            options: [],
          };
          const isNewVariantValid2: IIsProductVariantValid = {
            variant_name: true,
            options: [],
          };
          productToEdit.variant_detail.forEach((item) => {
            if (!newVariant1.options.includes(item.variant_type1_name)) {
              newVariant1.options.push(item.variant_type1_name);
              isNewVariantValid1.options.push(true);
            }
            if (!newVariant2.options.includes(item.variant_type2_name)) {
              newVariant2.options.push(item.variant_type2_name);
              isNewVariantValid2.options.push(true);
            }
          });
          newVariants.push(newVariant1);
          newVariants.push(newVariant2);
          setVariants(newVariants);
          isNewVariantsValid.push(isNewVariantValid1);
          isNewVariantsValid.push(isNewVariantValid2);
          setIsVariantsValid(isNewVariantsValid);
          const newPrice = new Array(maxOptLength).fill(
            new Array(maxOptLength).fill(0),
          );
          const newStock = new Array(maxOptLength).fill(
            new Array(maxOptLength).fill(0),
          );
          let k = 0;
          for (let i = 0; i < newVariant1.options.length; i++) {
            for (let j = 0; j < newVariant2.options.length; j++) {
              const smallPrice = [...newPrice[i]];
              smallPrice[j] = productToEdit.variant_detail[j + k].price;
              newPrice[i] = smallPrice;

              const smallStock = [...newStock[i]];
              smallStock[j] = productToEdit.variant_detail[j + k].stock;
              newStock[i] = smallStock;
            }
            k += newVariant1.options.length;
          }
          setPrice(newPrice);
          setStocks(newStock);
        }
      }
    } catch (error) {
      Utils.handleGeneralError(error);
      console.error(error);
    } finally {
      setIsInitialStateLoading(false);
    }
  }

  useEffect(() => {
    if (isEdit) {
      setInitialStateForEdit();
    }
  }, [productToEdit]);

  if (isInitialStateLoading) {
    return <DotsLoading />;
  }

  return (
    <div className="w-[70vw] flex flex-col gap-8">
      <section className="bg-white w-full rounded-xl p-8 shadow-lg">
        <p className="font-bold text-[12px] lg:text-[16px] pb-4">
          {'Product Information'}
        </p>
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col gap-1 w-full">
            <p className="w-full font-light text-xs pl-40">{`${productInformation.product_name.length} / ${maxNameLength} characters`}</p>
            <div className="flex items-center gap-2 w-full">
              <Label
                className="min-w-fit w-40 text-right font-light text-xs lg:text-sm"
                htmlFor="product-name"
              >
                Product name
                <span className="text-primary">{'* '}</span>:
              </Label>
              <Input
                id="product-name"
                type="text"
                className="w-full"
                value={productInformation.product_name}
                onChange={(e) =>
                  handleChangeProductInfoString(e, 'product_name')
                }
                isValid={isProductInformationValid.product_name}
                onBlur={() => validateOnBlur('product_name')}
                required
              />
            </div>
            {!isProductInformationValid.product_name && (
              <p className="w-full text-destructive text-xs pl-40">
                Name cannot be empty
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <p className="w-full font-light text-xs pl-40">{`(gram)`}</p>
            <div className="flex items-center gap-2 w-full">
              <Label
                className="min-w-fit w-40 text-right font-light text-xs lg:text-sm"
                htmlFor="product-weight"
              >
                Product weight
                <span className="text-primary">{'* '}</span>:
              </Label>
              <Input
                id="product-weight"
                type="number"
                className={`${styles.hideIndicator} w-full`}
                value={productInformation.weight}
                onChange={(e) => handleChangeWeight(e)}
                isValid={isProductInformationValid.weight}
                onBlur={() => validateOnBlur('weight')}
                min={1}
                onKeyDown={(e) => handleNumKeyDown(e)}
                onWheel={(e) => e.currentTarget.blur()}
                required
              />
            </div>
            {!isProductInformationValid.weight && (
              <p className="w-full text-destructive text-xs pl-40">
                Weight cannot be empty or below 1
              </p>
            )}
          </div>
          <PhotosArray
            tempProductPhotos={tempProductPhotos}
            setTempProductPhotos={setTempProductPhotos}
            remainingPhotos={remainingPhotos}
            setRemainingPhotos={setRemainingPhotos}
            maxPhoto={maxPhoto}
          />
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-end w-full justify-between">
              <Label
                className="min-w-fit text-right font-light text-xs lg:text-sm"
                htmlFor="product-description"
              >
                Product description
                <span className="text-primary">{'* '}</span>:
              </Label>
              <p className="w-fit font-light text-xs">{`${productInformation.product_desc.length} / ${maxDescLength} characters`}</p>
            </div>
            <Textarea
              id="product-description"
              className="w-full h-60"
              value={productInformation.product_desc}
              onChange={(e) => handleChangeProductInfoString(e, 'product_desc')}
              isValid={isProductInformationValid.product_desc}
              onBlur={() => validateOnBlur('product_desc')}
              required
            />
            {!isProductInformationValid.product_desc && (
              <p className="w-full text-destructive text-xs">
                {`Description cannot be less than ${minDescLength} characters`}
              </p>
            )}
          </div>
        </div>
      </section>
      {/* Product Category -- START */}
      <section className="bg-white w-full rounded-xl p-8 shadow-lg">
        <p className="font-bold text-[12px] lg:text-[16px] pb-1">
          {'Product Category'}
        </p>
        <p
          className={`font-light pb-4 text-sm ${
            isCategoryValid ? 'text-gray-500' : 'text-destructive'
          }`}
        >
          {'Product must have category 1 and category 2'}
        </p>
        <div className="w-full flex flex-col gap-5">
          {category1Options.length !== 0 && (
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-end w-full justify-between">
                <Label
                  className="min-w-fit text-right font-light text-xs lg:text-sm"
                  htmlFor="product-category-1"
                >
                  Product Category 1<span className="text-primary">{' *'}</span>
                  :
                </Label>
              </div>
              <Select
                onValueChange={(value) => handleCategory1Change(value)}
                defaultValue={category1}
              >
                <SelectTrigger id="product-category-1" className="mt-1">
                  <SelectValue placeholder="Category 1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category 1</SelectLabel>
                    {category1Options.map((category, index) => (
                      <SelectItem value={category.value.toString()} key={index}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          {!isCatFetchLoading &&
            category1 !== undefined &&
            category2Options.length !== 0 && (
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-end w-full justify-between">
                  <Label
                    className="min-w-fit text-right font-light text-xs lg:text-sm"
                    htmlFor="product-category-2"
                  >
                    Product Category 2
                    <span className="text-primary">{' *'}</span>:
                  </Label>
                </div>
                <Select
                  onValueChange={(value) => handleCategory2Change(value)}
                  defaultValue={category2}
                >
                  <SelectTrigger
                    id="product-category-2"
                    className="mt-1"
                    disabled={category1 === undefined}
                  >
                    <SelectValue placeholder="Category 2" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category 2</SelectLabel>
                      {category2Options.map((category, index) => (
                        <SelectItem
                          value={category.value.toString()}
                          key={index}
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
        </div>
      </section>
      {/* Product Category -- END */}
      {/* Product Variants -- START */}
      <section className="bg-white w-full rounded-xl p-8 shadow-lg">
        <p className="font-bold text-[12px] lg:text-[16px] pb-4">
          {'Price & Stock'}
        </p>
        <ProductVariant
          isVariantActive={isVariantActive}
          setIsVariantActive={setIsVariantActive}
          noVarPrice={noVarPrice}
          setNoVarPrice={setNoVarPrice}
          noVarStock={noVarStock}
          setNoVarStock={setNoVarStock}
          isNoVarValid={isNoVarValid}
          setIsNoVarValid={setIsNoVarValid}
          variants={variants}
          setVariants={setVariants}
          isVariantsValid={isVariantsValid}
          setIsVariantsValid={setIsVariantsValid}
          price={price}
          setPrice={setPrice}
          stocks={stocks}
          bg-white
          setStocks={setStocks}
          isPriceValid={isPriceValid}
          setIsPriceValid={setIsPriceValid}
          isStockValid={isStockValid}
          setIsStockValid={setIsStockValid}
          checkIfOptDuplicate={checkIfOptDuplicate}
          checkIfNameDuplicate={checkIfNameDuplicate}
          isEdit={true}
        />
      </section>
      {/* Product Variants -- END */}
      <section className="w-full flex justify-center items-center">
        <Button
          size={'customBlank'}
          className="w-full text-xl py-3"
          disabled={isPageLoading}
          onClick={postFormBody}
        >
          {isPageLoading ? (
            <div className="border-4 border-primary-foreground border-t-transparent animate-spin aspect-square h-6 rounded-full" />
          ) : (
            <p>Save Product</p>
          )}
        </Button>
      </section>
    </div>
  );
};

export default ProductForm;
