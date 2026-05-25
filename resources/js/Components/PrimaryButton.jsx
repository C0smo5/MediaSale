export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(124,58,237,0.22)] transition duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(124,58,237,0.28)] focus:outline-none focus:ring-4 focus:ring-[rgba(124,58,237,0.12)] active:translate-y-0 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
