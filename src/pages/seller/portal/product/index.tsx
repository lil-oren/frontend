import React, { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import axiosInstance from '@/lib/axiosInstance';
import { withBasePath } from '@/lib/nextUtils';
import { Utils } from '@/utils';
import SellerLayout from '@/components/SellerLayout/SellerLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IAdminProduct } from '@/interface/productAtAdminSeller';
import PaginationNav from '@/components/PaginationNav/PaginationNav';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AsyncButton from '@/components/AsyncButton/AsyncButton';
import EmptyNotify from '@/components/EmptyNotify/EmptyNotify';
import styles from './SellerPortalProduct.module.scss';

const data = [
  {
    id: 1,
    label: 'All Products',
    status: 'All Products',
    href: '/seller/portal/product',
  },
];

const SellerPortalProduct = () => {
  const router = useRouter();
  const [products, setProducts] = useState<IAdminProduct[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteProductCode, setDeleteProductCode] = useState<string>('');
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);

  function handleOpenDelete(productCode: string) {
    setDeleteProductCode(productCode);
    setIsDeleteOpen(true);
  }

  function handleCancelDelete() {
    setDeleteProductCode('');
    setIsDeleteOpen(false);
  }

  async function handleDelete() {
    setIsDeleteLoading(true);
    try {
      await axiosInstance.delete(`/merchant/product/${deleteProductCode}`);
      Utils.notify(
        `Successfully deleted ${deleteProductCode}`,
        'info',
        'colored',
      );
      setUpdateToggle((prev) => !prev);
      setCurrentPage(1);
      handleCancelDelete();
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsDeleteLoading(false);
    }
  }

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await axiosInstance(
          `/merchant/product?page=${currentPage}`,
        );
        setProducts(response.data.data.products);
        setTotalPage(response.data.data.pagination.total_page);
      } catch (error) {
        Utils.handleGeneralError(error);
      }
    }
    getProducts();
  }, [currentPage, updateToggle]);
  return (
    <>
      <Head>
        <title>Seller Product - LilOren</title>
        <meta
          data-rh="true"
          name="viewport"
          content="initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=no, width=device-width"
        />
        <meta data-rh="true" property="site_name" content="LilOren" />
        <meta
          data-rh="true"
          name="description"
          content="Mal online terbesar Indonesia, tempat berkumpulnya toko / online shop terpercaya se Indonesia. Jual beli online semakin aman dan nyaman di LilOren."
        ></meta>
        <link rel="icon" href={withBasePath('favicon.ico')} />
      </Head>
      <div className={`${styles.sellerPortalProduct}`}>
        <section className={`flex flex-col w-[65vw] px-5 pb-5 bg-white`}>
          <div className="w-full flex pt-3">
            <Button
              onClick={() => router.push('/seller/portal/product/create')}
              className="w-[200px]"
            >
              Add new product
            </Button>
          </div>
          <div className="w-full mt-8">
            {products.length !== 0 ? (
              <Table>
                <TableCaption>
                  A list of your products from most recent.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thumbnail</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Product Code</TableHead>
                    <TableHead colSpan={3}>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length !== 0 &&
                    products.map((product) => (
                      <TableRow key={product.ProductCode}>
                        <TableCell>
                          <Image
                            src={product.ThumbnailURL}
                            alt={product.ProductName}
                            width={100}
                            height={100}
                            style={{ objectFit: 'cover' }}
                          />
                        </TableCell>
                        <TableCell className="truncate">
                          {product.ProductName}
                        </TableCell>
                        <TableCell className="truncate">
                          {product.ProductCode}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() =>
                              router.push(
                                `/seller/portal/product/${product.ProductCode}`,
                              )
                            }
                          >
                            Edit
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() =>
                              router.push(
                                `/seller/portal/product/discount/${product.ProductCode}`,
                              )
                            }
                          >
                            Manage Discount
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() =>
                              handleOpenDelete(product.ProductCode)
                            }
                            variant={'destructive'}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyNotify message="No Product" />
            )}
          </div>
          <div className="w-full flex justify-center items-center mt-5">
            <PaginationNav
              currentPage={currentPage}
              totalPage={totalPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </section>
      </div>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Delete product
            </AlertDialogTitle>
            <AlertDialogDescription>
              {`Are you susre you want to delete ${deleteProductCode}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="w-full flex justify-end items-center gap-2">
            <Button variant={'outline'} onClick={handleCancelDelete}>
              Cancel
            </Button>
            <AsyncButton
              onClick={handleDelete}
              isLoading={isDeleteLoading}
              variant={'outline'}
            >
              Delete
            </AsyncButton>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

SellerPortalProduct.getLayout = function getLayout(page: ReactElement) {
  return (
    <SellerLayout tabData={data} header="Product List">
      {page}
    </SellerLayout>
  );
};

export default SellerPortalProduct;
