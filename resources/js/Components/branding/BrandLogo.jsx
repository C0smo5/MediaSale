import { Link } from '@inertiajs/react';
import { FilterIcon } from '@/Components/landing/Icons/Icons';

export default function BrandLogo({
    href = '/',
    nameClassName = '',
    iconClassName = '',
    nameStyle,
    iconStyle,
    text = 'Orin',
}) {
    return (
        <Link href={href} className="inline-flex items-center gap-2.5 no-underline">
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#a855f7] ${iconClassName}`}
                style={iconStyle}
            >
                <FilterIcon className="h-5 w-5 text-white" />
            </div>
            <span className={`font-display text-xl font-bold ${nameClassName}`} style={nameStyle}>
                {text}
            </span>
        </Link>
    );
}
