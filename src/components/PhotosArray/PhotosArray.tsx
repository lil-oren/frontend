import React, { Dispatch, SetStateAction, ChangeEvent } from 'react';
import Image from 'next/image';
import { ArrowUpFromLine, Info, XCircle } from 'lucide-react';
import styles from './PhotosArray.module.scss';

interface PhotosArrayProps {
  tempProductPhotos: File[];
  setTempProductPhotos: Dispatch<SetStateAction<File[]>>;
  remainingPhotos: number;
  setRemainingPhotos: Dispatch<SetStateAction<number>>;
  maxPhoto: number;
  isReviewForm?: boolean;
  product_code?: string;
}

const PhotosArray = ({
  tempProductPhotos,
  setTempProductPhotos,
  remainingPhotos,
  setRemainingPhotos,
  maxPhoto,
  isReviewForm = false,
  product_code,
}: PhotosArrayProps) => {
  const handleAddPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const selectedFiles = e.target.files;
      const newFiles = [...tempProductPhotos];
      newFiles.push(selectedFiles[0]);
      setTempProductPhotos(newFiles);
      setRemainingPhotos((prev) => prev - 1);
    }
  };
  const handleRemovePhoto = (indexToRemove: number) => {
    const newTempProductPhotos = [...tempProductPhotos];
    newTempProductPhotos.splice(indexToRemove, 1);
    setTempProductPhotos(newTempProductPhotos);
    setRemainingPhotos((prev) => prev + 1);
  };
  return (
    <div className="flex flex-col w-fit">
      <div className="font-light w-full text-[10px] lg:text-[12px] md:text-base flex gap-2">
        <p className="text-[12px] lg:text-[14px]">{'Product Photos'}</p>
        {!isReviewForm && <span className="text-primary">{' *'}</span>}
        {!isReviewForm && (
          <div className={styles.product_icon}>
            <Info size={15} className="text-muted-foreground" />
            <div
              className={`${styles.product_info} bg-white sm:w-[350px] md:w-[400px] lg:w-[500px] text-[12px] absolute p-6 rounded-xl border-2 duration-500 before:ease-in-out after:ease-in-out`}
            >
              <p>
                {`Image format .jpg .jpeg .png and minimum size 300 x 300px (For optimal images use a minimum size of 700 x 700 px). Select a product photo. Upload min. 1 photo that are interesting and different from each other to attract buyers' attention.`}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className={`flex flex-wrap`}>
        {tempProductPhotos.map(
          (file, index) =>
            file && (
              <div key={`key-${index.toString()}`} className="relative p-3">
                <Image
                  src={URL.createObjectURL(file)}
                  width={200}
                  height={200}
                  alt={'product'}
                  style={{ objectFit: 'cover' }}
                  className="border-2 border-dashed h-[75px] w-[75px] hover:border-primary duration-500 before:ease-in-out after:ease-in-out lg:h-[100px] lg:w-[100px] rounded-lg"
                />
                <XCircle
                  className="text-white bg-destructive hover:bg-red-700 h-fit w-fit rounded-full absolute top-1 right-1 cursor-pointer"
                  onClick={() => handleRemovePhoto(index)}
                />
              </div>
            ),
        )}
        {remainingPhotos !== 0 && (
          <div className="p-3">
            <label
              className="border-2 border-dashed flex flex-col justify-center items-center h-[75px] w-[75px] gap-2 hover:border-primary duration-500 before:ease-in-out after:ease-in-out text-primary hover:bg-primary/5 lg:h-[100px] lg:w-[100px] rounded-lg cursor-pointer"
              htmlFor={
                product_code !== undefined
                  ? product_code
                  : `key-image:${tempProductPhotos.length - 1}`
              }
            >
              <ArrowUpFromLine />
              <p className="text-[10px] lg:text-[12px] font-bold">{`${remainingPhotos} / ${maxPhoto}`}</p>
              <p className="text-[10px] lg:text-[12px]">Upload Photo</p>
            </label>
            <input
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => {
                handleAddPhoto(e);
                e.target.value = '';
              }}
              type="file"
              id={
                product_code !== undefined
                  ? product_code
                  : `key-image:${tempProductPhotos.length - 1}`
              }
              disabled={tempProductPhotos.length === maxPhoto}
              hidden
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotosArray;
