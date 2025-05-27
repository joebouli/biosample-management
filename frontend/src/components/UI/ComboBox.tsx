import {Combobox} from '@headlessui/react';
import {ChevronDown} from 'lucide-react';

type Props = {
    label: string;               // Label text for the combobox input
    options: string[];           // List of selectable options
    value: string;               // Current selected value (controlled)
    onChange: (value: string) => void;  // Callback when value changes
    disabled?: boolean;          // Disable the combobox (default: false)
    isInvalid?: boolean;         // Show error styling if true (default: false)
};

export default function ComboBox({
                                     label,
                                     options,
                                     value,
                                     onChange,
                                     disabled = false,
                                     isInvalid = false,
                                 }: Props) {
    // Filter options based on current input value (case-insensitive substring match)
    const filteredOptions = value.trim()
        ? options.filter((option) =>
            option.toLowerCase().includes(value.toLowerCase())
        )
        : options;

    return (
        <div className="relative w-full">
            {/* Headless UI Combobox manages ARIA and keyboard interactions */}
            <Combobox value={value} onChange={onChange} disabled={disabled}>
                {({open}) => (
                    <div className="relative">
                        {/* Input field for filtering/selecting options */}
                        <Combobox.Input
                            className={`
                peer w-full rounded-lg border px-3 pt-5 pb-2 text-sm placeholder-transparent
                focus:outline-none focus:ring-1 transition
                ${
                                // Red border and ring if invalid
                                isInvalid
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-customGrayBorder focus:ring-customGrayRing'
                            }
                ${
                                // Disabled styles: cursor not allowed
                                disabled ? 'bg-gray-50 opacity-50 cursor-not-allowed' : ''
                            }
              `}
                            // Display value in the input
                            displayValue={(val: string) => val}
                            // Update selected value on input change
                            onChange={(e) => onChange(e.target.value)}
                            placeholder=" " // Empty placeholder to trigger label float
                        />

                        {/* Label positioned above the input */}
                        <label
                            className="absolute left-3 top-2 text-[10px] text-customGrayLabel pointer-events-none
                transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-customGrayLabelPlaceholder"
                        >
                            {label}
                        </label>

                        {/* Button to toggle the dropdown, with a chevron icon */}
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                    open ? 'rotate-180' : ''
                                } ${
                                    disabled ? 'text-gray-400' : 'text-gray-500'
                                }`}
                            />
                        </Combobox.Button>

                        {/* Dropdown menu with filtered options, shown only when open */}
                        {open && (
                            <Combobox.Options
                                className="absolute z-10 mt-1 max-h-36 w-full overflow-auto rounded border border-customGrayBorder bg-white shadow-lg"
                            >
                                {filteredOptions.length === 0 ? (
                                    // When no matching options, show an "Add" option with current input
                                    <Combobox.Option
                                        value={value}
                                        className="cursor-pointer select-none p-2 text-gray-500 hover:bg-green-50"
                                    >
                                        Add "{value}"
                                    </Combobox.Option>
                                ) : (
                                    // Map filtered options to Combobox.Option elements with active state styling
                                    filteredOptions.map((option) => (
                                        <Combobox.Option
                                            key={option}
                                            value={option}
                                            className={({active}) =>
                                                `cursor-pointer select-none p-2 transition-colors ${
                                                    active
                                                        ? 'bg-green-900 text-white'
                                                        : 'text-gray-900 hover:bg-green-50'
                                                }`
                                            }
                                        >
                                            {option}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        )}
                    </div>
                )}
            </Combobox>
        </div>
    );
}