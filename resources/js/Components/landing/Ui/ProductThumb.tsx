import React, { useEffect, useState } from 'react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=112&h=112&fit=crop&q=80';

interface ProductThumbProps {
  src: string;
  alt: string;
  isBest?: boolean;
}

export const ProductThumb: React.FC<ProductThumbProps> = ({ src, alt, isBest = false }) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden rounded-xl bg-surface-alt ${
        isBest ? 'h-14 w-14 ring-2 ring-emerald-brand/35 shadow-sm' : 'h-11 w-11 ring-1 ring-brand-soft'
      }`}
    >
      <img
        src={imgSrc}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        onError={() => {
          if (imgSrc !== FALLBACK_IMAGE) setImgSrc(FALLBACK_IMAGE);
        }}
      />
    </div>
  );
};
