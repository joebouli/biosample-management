import {useState, useEffect} from 'react';
import {fetchOperators, fetchSampleTypes} from '../../api/biosamples';
import type {BioSampleCreate} from '../../types';
import FloatingInput from '../UI/FloatingInput';
import ComboBox from '../UI/ComboBox';
import {useApi} from "../../hooks/useApi.ts";

type Props = {
    initialData?: BioSampleCreate;                // Optional initial data to prefill the form (for editing)
    onSubmit: (data: BioSampleCreate) => void;   // Callback to handle form submission with valid data
    onCancel?: () => void;                        // Optional callback to handle cancel button click
    isSubmitting?: boolean;                       // Flag to indicate if form is submitting (disables inputs/buttons)
};

export default function BioSampleForm({
                                          initialData,
                                          onSubmit,
                                          onCancel,
                                          isSubmitting = false,
                                      }: Props) {
    // State for form fields with default empty values
    const [formData, setFormData] = useState<BioSampleCreate>({
        location: '',
        sampleTypeName: '',
        samplingDate: '',
        operatorName: '',
    });

    // Custom hook to manage API calls for operators list
    const operatorsApi = useApi<string[]>({
        onError: (error) => {
            console.error('Failed to load operators:', error);
        },
    });

    // Custom hook to manage API calls for sample types list
    const sampleTypesApi = useApi<string[]>({
        onError: (error) => {
            console.error('Failed to load sample types:', error);
        },
    });

    // When initialData changes (e.g. on edit), prefill the form fields
    useEffect(() => {
        if (initialData) {
            setFormData({
                location: initialData.location || '',
                sampleTypeName: initialData.sampleTypeName || '',
                samplingDate: initialData.samplingDate || '',
                operatorName: initialData.operatorName || '',
            });
        }
    }, [initialData]);

    // Load operators and sample types from API when component mounts
    useEffect(() => {
        async function loadData() {
            try {
                await operatorsApi.execute(fetchOperators);
                await sampleTypesApi.execute(fetchSampleTypes);
            } catch (error) {
            }
        }
        loadData();
    }, []);

    // Handle changes for text inputs (location, samplingDate)
    const handleInputChange = (field: keyof BioSampleCreate) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value || '',
        }));
    };

    // Handle changes for ComboBox selects (sampleTypeName, operatorName)
    const handleSelectChange = (field: keyof BioSampleCreate) => (value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value || '',
        }));
    };

    // Track validation errors for each field (true if invalid)
    const [errors, setErrors] = useState({
        location: false,
        sampleTypeName: false,
        samplingDate: false,
        operatorName: false,
    });

    // Form submission handler with validation
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check each field for empty or whitespace-only value
        const newErrors = {
            location: !formData.location.trim(),
            sampleTypeName: !formData.sampleTypeName.trim(),
            samplingDate: !formData.samplingDate.trim(),
            operatorName: !formData.operatorName.trim(),
        };

        setErrors(newErrors);

        // If any errors, stop submission
        const hasErrors = Object.values(newErrors).some(Boolean);
        if (hasErrors) return;

        // Call the onSubmit callback with trimmed values
        onSubmit({
            location: formData.location.trim(),
            sampleTypeName: formData.sampleTypeName.trim(),
            samplingDate: formData.samplingDate.trim(),
            operatorName: formData.operatorName.trim(),
        });
    };

    // Disable form if submitting or if options are still loading
    const isLoadingOptions = operatorsApi.loading || sampleTypesApi.loading;
    const isFormDisabled = isSubmitting || isLoadingOptions;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Text input for location */}
            <FloatingInput
                id="location"
                label="Location"
                value={formData.location}
                onChange={handleInputChange('location')}
                autoFocus
                disabled={isFormDisabled}
                isInvalid={errors.location}
            />

            {/* ComboBox select for sample type, options from API */}
            <ComboBox
                label="Sample Type"
                options={sampleTypesApi.data || []}
                value={formData.sampleTypeName}
                onChange={handleSelectChange('sampleTypeName')}
                disabled={isFormDisabled}
                isInvalid={errors.sampleTypeName}
            />

            {/* Date input for sampling date */}
            <FloatingInput
                id="samplingDate"
                label="Sampling Date"
                type="date"
                value={formData.samplingDate}
                onChange={handleInputChange('samplingDate')}
                disabled={isFormDisabled}
                isInvalid={errors.samplingDate}
                min="1900-01-01"
                max="2100-01-01"
            />

            {/* ComboBox select for operator, options from API */}
            <ComboBox
                label="Operator"
                options={operatorsApi.data || []}
                value={formData.operatorName}
                onChange={handleSelectChange('operatorName')}
                disabled={isFormDisabled}
                isInvalid={errors.operatorName}
            />

            {/* Buttons for Cancel and Submit */}
            <div className="flex justify-end gap-3 mt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="rounded-lg bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isFormDisabled}
                    className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}
