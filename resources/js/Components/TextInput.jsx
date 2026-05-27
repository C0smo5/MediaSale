import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'box-border min-w-0 max-w-full w-full rounded-xl border border-[rgba(124,58,237,0.18)] bg-[#f8f7ff] px-4 py-3 text-base text-[#1a1040] shadow-sm outline-none transition-all duration-200 placeholder:text-[#8a83a8] focus:border-[#7c3aed] focus:ring-4 focus:ring-[rgba(124,58,237,0.10)] sm:text-sm ' +
                className
            }
            ref={localRef}
        />
    );
});
