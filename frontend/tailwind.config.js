/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    beige: '#f5f4f1',
                    customGrayLight: '#dfe3dc',
                    customGrayBorder: '#ccd5bb',
                    customGrayRing: '#c8d1b5',
                    customGrayLabel: '#7a8466',
                    customGrayLabelPlaceholder: '#a5ae99',
                },
                ringColor: {
                    'green-soft': 'rgba(22,101,52,0.4)',
                }
            },
            borderColor: {
                customGrayLight: '#dfe3dc',
                customGrayBorder: '#ccd5bb',
            },
            ringColor: {
                customGrayRing: '#c8d1b5',
            },
            textColor: {
                customGrayLabel: '#7a8466',
                customGrayLabelPlaceholder: '#a5ae99',
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar'),
    ],
}
