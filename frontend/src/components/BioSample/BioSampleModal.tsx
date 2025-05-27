import {useApi} from '../../hooks/useApi'; // Adjust path if needed
import BioSampleForm from './BioSampleForm';
import type {BioSample, BioSampleCreate} from '../../types';

type Props = {
    isOpen: boolean;                          // Whether the modal is visible
    onClose: () => void;                      // Callback to close the modal
    onSubmit: (data: BioSampleCreate) => Promise<void>; // Callback to submit the form data
    initialData?: BioSample;                  // Optional data to prefill the form
    title: string;                           // Title displayed on the modal
};

export default function BioSampleModal({
                                           isOpen,
                                           onClose,
                                           onSubmit,
                                           initialData,
                                           title,
                                       }: Props) {
    // Custom hook to manage API call state for form submission
    const {loading: isSubmitting, error, execute, reset} = useApi<void>({
        onSuccess: () => {
            onClose();  // Close modal on successful submit
            reset();    // Reset API hook state (e.g., clear error)
        },
    });

    if (!isOpen) return null;

    // Wrap form submission to execute API call and handle loading/error state
    const handleSubmit = (data: BioSampleCreate) => {
        return execute(() => onSubmit(data));
    };

    // Handle modal close action; prevent closing while submitting
    const handleClose = () => {
        if (isSubmitting) return; // Prevent closing during submission
        reset();                 // Clear API error/loading state
        onClose();               // Call parent close handler
    };

    return (

        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
            <div
                className="bg-white rounded-lg p-6 w-[400px] max-w-full max-h-[95vh]"
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >

                <h2 className="text-xl font-semibold text-green-900 mb-6">{title}</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <BioSampleForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
