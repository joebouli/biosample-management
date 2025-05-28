import {useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Plus} from 'lucide-react';
import {useApi} from '../hooks/useApi';
import {usePagination} from '../hooks/usePagination';
import {useModal} from '../hooks/useModal';
import {fetchBioSamples, createBioSample} from '../api/biosamples';
import type {BioSample, BioSampleCreate, PaginatedResponse} from '../types';
import IconButton from '../components/UI/IconButton';
import BioSampleList from "../components/BioSample/BioSampleList";
import Pagination from "../components/UI/Pagination";
import BioSampleModal from "../components/BioSample/BioSampleModal";

export default function BioSampleListPage() {
    const navigate = useNavigate();

    // Modal controls to open/close the create BioSample modal
    const {isOpen: showModal, open: openModal, close: closeModal} = useModal();

    // API hook to handle fetching samples list with loading, error and data states
    const samplesApi = useApi<PaginatedResponse<BioSample>>({
        onError: (errorMessage) => {
            console.error('Failed to load samples:', errorMessage);
        },
    });

    // API hook to handle creation of new BioSample,
    // onSuccess we close modal, reset pagination to first page, and reload samples list
    const createApi = useApi<BioSample>({
        onSuccess: () => {
            closeModal();
            pagination.goToFirstPage();
            loadSamples();
        },
        onError: (errorMessage) => {
            console.error('Failed to create sample:', errorMessage);
        }
    });

    // Pagination hook: manages current page, items per page, offset, total count, total pages etc.
    const pagination = usePagination({itemsPerPage: 16});

    /**
     * Function to load samples from the API with current pagination parameters.
     * Wrapped with useCallback to memoize and avoid unnecessary reloads.
     * On success, sets total count for pagination.
     * On failure, logs error to console.
     */
    const loadSamples = useCallback(() => {
        samplesApi.execute(() => fetchBioSamples(pagination.itemsPerPage, pagination.offset))
            .then(data => pagination.setTotalCount(data.totalCount))
            .catch(error => {
                console.warn('Error handled in catch:', error);
            });
    }, [samplesApi, pagination.itemsPerPage, pagination.offset, pagination.setTotalCount]);

    // Reload samples whenever the current page changes
    useEffect(() => {
        loadSamples();
    }, [pagination.currentPage]);

    // Handle when user selects a sample: navigate to the detail page of that sample
    const handleSampleSelect = (sample: BioSample) => {
        navigate(`/biosamples/${sample.id}`);
    };

    // Handle creating a new sample by calling create API hook with form data
    const handleCreateSample = async (data: BioSampleCreate): Promise<void> => {
        try {
            await createApi.execute(() => createBioSample(data));
        } catch (error) {
        }
    };

    // Show loading screen if samples are loading and no data yet
    if (samplesApi.loading && !samplesApi.data) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-beige">
                <div className="text-gray-600">Loading samples...</div>
            </div>
        );
    }

    // Show error screen if there was an error loading samples and no data to show
    if (samplesApi.error && !samplesApi.data) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-beige">
                <div className="text-center">
                    <div className="text-red-600 mb-4">{samplesApi.error}</div>
                    {/* Button to retry loading samples */}
                    <button onClick={loadSamples} className="text-green-600 hover:text-green-700 underline">
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    // Extract samples list or default to empty array if none
    const samples = samplesApi.data?.results || [];

    return (
        <div className="flex flex-col h-screen bg-background-beige text-gray-800 p-6 overflow-hidden">
            {/* Header with title and "create new sample" button */}
            <header className="flex justify-between items-center flex-shrink-0 mb-4">
                <h1 className="text-2xl font-semibold text-green-900">BioSample Manager</h1>
                <IconButton onClick={openModal} title="Create New BioSample">
                    <Plus size={18}/>
                </IconButton>
            </header>

            {/* Main content area showing the list of samples */}
            <main className="flex-1 overflow-y-auto rounded-lg shadow bg-background-beige">
                {/* Show subtle loading indicator if fetching samples but data already present */}
                {samplesApi.loading && (
                    <div className="absolute top-4 right-4 text-sm text-gray-500 bg-white px-3 py-1 rounded shadow">
                        Loading...
                    </div>
                )}
                {/* Sample list component receives data and callback for selection */}
                <BioSampleList samples={samples} onSelectSample={handleSampleSelect}/>
            </main>

            {/* Pagination controls shown only if more than one page */}
            {pagination.totalPages > 1 && (
                <footer className="mt-4 flex justify-center">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.setCurrentPage}
                    />
                </footer>
            )}

            {/* Modal for creating new BioSample, controlled by modal hooks */}
            <BioSampleModal
                isOpen={showModal}
                onClose={closeModal}
                onSubmit={handleCreateSample}
                title="Create New BioSample"
            />
        </div>
    );
}
