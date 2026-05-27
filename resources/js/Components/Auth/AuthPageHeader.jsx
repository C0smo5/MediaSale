export default function AuthPageHeader({ badge, title, description, icon, children }) {
    return (
        <div className="mb-7 sm:mb-8">
            <div className="flex flex-wrap items-center gap-3">
                {icon && (
                    <span
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl"
                        style={{
                            backgroundColor: '#ede9fe',
                            color: '#7c3aed',
                            boxShadow: 'inset 0 0 0 1px rgba(124,58,237,0.12)',
                        }}
                        aria-hidden
                    >
                        {icon}
                    </span>
                )}

                {badge && (
                    <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.18em]"
                        style={{
                            backgroundColor: '#ede9fe',
                            color: '#7c3aed',
                            border: '1px solid rgba(124,58,237,0.18)',
                        }}
                    >
                        {badge}
                    </span>
                )}
            </div>

            <h1
                className="mt-4 break-words text-[1.6rem] font-bold leading-[1.15] tracking-tight sm:mt-5 sm:text-3xl"
                style={{ color: '#1a1040' }}
            >
                {title}
            </h1>

            {description && (
                <p className="mt-2.5 break-words text-sm leading-6 sm:text-[15px]" style={{ color: '#6b6b8a' }}>
                    {description}
                </p>
            )}

            {children}
        </div>
    );
}
