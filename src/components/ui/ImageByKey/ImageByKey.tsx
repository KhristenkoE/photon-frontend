import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

type Props = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

type ImageByKeyProps = Props & {
  imgKey?: string;
  imgUrl?: string;
};

export const ImageByKey = ({ imgKey, imgUrl, ...props }: ImageByKeyProps) => {
  const src = imgKey
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${imgKey}`
    : imgUrl;
  return <img src={src || '/assets/icons/avatar-empty.svg'} {...props} />;
};
