export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-sm font-medium text-[#dc2626] ' + className}
        >
            {message}
        </p>
    ) : null;
}
