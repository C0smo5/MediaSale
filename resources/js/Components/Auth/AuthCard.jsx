const variants = {
    default: {
        borderColor: 'rgba(124,58,237,0.16)',
        backgroundColor: 'rgba(124,58,237,0.03)',
    },
    success: {
        borderColor: 'rgba(5,150,105,0.22)',
        backgroundColor: '#ecfdf5',
    },
};

export default function AuthCard({
    as: Component = 'div',
    variant = 'default',
    className = '',
    children,
    ...props
}) {
    return (
        <Component
            className={`auth-card ${className}`}
            style={variants[variant] ?? variants.default}
            {...props}
        >
            {children}
        </Component>
    );
}

export function AuthCardGrid({ children, className = '' }) {
    return <div className={`auth-card-grid ${className}`}>{children}</div>;
}

export function AuthCardCell({ children, className = '' }) {
    return <div className={`auth-card-cell ${className}`}>{children}</div>;
}
