import React from 'react';

type Props = {
    id: string; // input and label id
    label: string; // label text
    type?: string; // input type (default: text)
    value: string; // controlled input value
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // change handler
    required?: boolean; // required or not (default: false)
    autoFocus?: boolean; // autofocus (default: false)
    disabled?: boolean; // disabled state (default: false)
    isInvalid?: boolean; // error state (default: false)
} & React.InputHTMLAttributes<HTMLInputElement>; // native input props

export default function FloatingInput({
    id,
    label,
    type = 'text',
    value,
    onChange,
    required = false,
    autoFocus = false,
    disabled = false,
    isInvalid = false,
    ...rest
}: Props) {
    return (
        <div className="relative">
            {/* Input with floating label */}
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder=" " // invisible placeholder to trigger label animation
                required={required}
                autoFocus={autoFocus}
                disabled={disabled}
                className={`peer w-full rounded-lg border px-3 pt-5 pb-2 text-sm placeholder-transparent focus:outline-none focus:ring-1 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 
                    ${isInvalid ? 'border-red-500 focus:ring-red-500' : 'border-customGrayBorder focus:ring-customGrayRing'}`}
                {...rest}
            />
            {/* Label moves and shrinks on input focus or value */}
            <label
                htmlFor={id}
                className="absolute left-3 top-2 text-[10px] text-customGrayLabel peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-customGrayLabelPlaceholder transition-all pointer-events-none"
            >
                {label}
            </label>
        </div>
    );
}
