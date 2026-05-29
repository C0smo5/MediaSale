import React from 'react';

type DemoResultThumbProps = {
    src: string;
    alt: string;
    match?: number;
    highlight?: boolean;
    className?: string;
};

export const DemoResultThumb: React.FC<DemoResultThumbProps> = ({
    src,
    alt,
    match,
    highlight = false,
    className = '',
}) => (
    <div className={`relative h-11 w-11 flex-shrink-0 ${className}`}>
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={`h-11 w-11 rounded-xl object-cover ring-1 ${
                highlight ? 'ring-emerald-brand/30' : 'ring-brand/10'
            } bg-surface-alt`}
        />
        {match !== undefined && (
            <span
                className={`absolute -bottom-1 -right-1 rounded-md px-1 py-0.5 text-[9px] font-bold leading-none ${
                    highlight ? 'bg-emerald-brand text-white' : 'bg-panel-soft text-brand ring-1 ring-brand/20'
                }`}
            >
                {match}%
            </span>
        )}
    </div>
);
