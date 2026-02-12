"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  fallbackSrc: string;
  alt: string;
}

const ImageWithFallback = ({ src, fallbackSrc, alt, ...rest }: Props) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      key={imgSrc} // ⭐ маш чухал
      src={imgSrc}
      alt={alt}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover opacity-80"
      fill
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
      {...rest}
    />
  );
};

export default ImageWithFallback;
