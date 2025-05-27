type ConfirmModalProps = {
    isOpen: boolean; // modal visibility
    onClose: () => void; // called to close modal
    onConfirm: () => void; // called to confirm action
    message: string; // confirmation message text
    title?: string; // modal title (default: "Confirm")
    isLoading?: boolean; // loading state for confirm button
};

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    message,
    title = "Confirm",
    isLoading = false
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
            {/* Modal content container */}
            <div
                className="bg-white rounded-lg p-6 w-[350px] max-w-full"
                onClick={(e) => e.stopPropagation()} // prevent overlay click closing modal
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
            >
                {/* Modal title */}
                <h2 id="confirm-modal-title" className="text-lg font-semibold text-green-900 mb-4">
                    {title}
                </h2>
                {/* Confirmation message */}
                <p className="mb-6">{message}</p>
                {/* Action buttons */}
                <div className="flex justify-end gap-4">
                    {/* Cancel button */}
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    {/* Confirm button with loading state */}
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
