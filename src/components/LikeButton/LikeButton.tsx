import React, { Dispatch, SetStateAction } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  isLiked: boolean;
  setIsLiked: Dispatch<SetStateAction<boolean>>;
  likedAmount?: number;
}

const LikeButton = ({
  isLiked = false,
  setIsLiked,
  likedAmount,
}: LikeButtonProps) => {
  return (
    <button
      className={`flex items-center gap-1 focus:outline-none`}
      onClick={() => setIsLiked((prev) => !prev)}
    >
      <Heart
        className={`aspect-square w-5 duration-300 lg:hover:text-blue-500 focus:outline-none sm:w-8 xl:w-9 ${
          isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
        }`}
      />
      {likedAmount && (
        <p
          className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-black'}`}
        >
          {likedAmount}
        </p>
      )}
    </button>
  );
};

export default LikeButton;
