import React, {type ReactNode} from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;      // Content inside the button (usually an icon)
    title?: string;          // Tooltip text shown on hover (optional)
}

export function IconButton({children, title, className = '', ...props}: IconButtonProps) {
    return (
        <button
            {...props}
            title={title}
            className={`border border-green-600 bg-white text-green-600 rounded-full p-2 hover:bg-green-50 transition hover:shadow-md flex items-center justify-center ${className}`}
        >
            {children}
        </button>
    );
}
