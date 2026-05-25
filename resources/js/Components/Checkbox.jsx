export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded-md border-[rgba(124,58,237,0.24)] text-[#7c3aed] shadow-sm focus:ring-[#7c3aed] ' +
                className
            }
        />
    );
}
