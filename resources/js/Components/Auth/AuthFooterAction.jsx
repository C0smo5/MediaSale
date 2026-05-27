import { Link } from '@inertiajs/react';

export default function AuthFooterAction({
    text,
    linkLabel,
    href,
    method,
    as,
    align = 'center',
}) {
    const alignment = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

    return (
        <div
            className={`mt-6 border-t pt-5 ${alignment}`}
            style={{ borderColor: 'rgba(124,58,237,0.10)' }}
        >
            <p className="text-sm" style={{ color: '#6b6b8a' }}>
                {text && <span className="mr-1.5">{text}</span>}
                <Link
                    href={href}
                    method={method}
                    as={as}
                    className="font-semibold underline-offset-4 hover:underline"
                    style={{ color: '#7c3aed' }}
                >
                    {linkLabel}
                </Link>
            </p>
        </div>
    );
}
