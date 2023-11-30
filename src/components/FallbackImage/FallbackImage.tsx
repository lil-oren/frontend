import { useEffect, useState } from 'react';
import Image from 'next/image';
import { withBasePath } from '@/lib/nextUtils';

interface FallbackImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  style?: any;
  sizes?: string;
  width?: number;
  height?: number;
  className?: string;
}
const FallbackImage = ({
  src,
  alt,
  fill,
  style,
  sizes,
  width,
  height,
  className,
  ...rest
}: FallbackImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc || withBasePath('/not-found.jpg')}
      onError={() => {
        setImgSrc(withBasePath('/not-found.jpg'));
      }}
      alt={alt}
      fill={fill}
      style={style}
      sizes={sizes}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default FallbackImage;
