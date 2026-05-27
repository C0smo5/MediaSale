export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `mb-1.5 block text-sm font-medium text-[#1a1040] ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
