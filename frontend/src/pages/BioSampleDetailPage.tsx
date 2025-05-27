import {useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';
import {useApi} from '../hooks/useApi';
import {useModal} from '../hooks/useModal';
import {fetchBioSampleById, updateBioSample, deleteBioSample} from '../api/biosamples';
import type {BioSample, BioSampleCreate} from '../types';
import {IconButton} from '../components/UI/IconButton';
import BioSampleModal from '../components/BioSample/BioSampleModal';
import BioSampleDetail from '../components/BioSample/BioSampleDetail';
import CommentsSection from '../components/Comment/CommentsSection';
import {ConfirmModal} from "../components/UI/ConfirmModal.tsx";

export default function BioSampleDetailPage() {
    // Get the 'id' parameter from the URL using React Router hook
    const {id} = useParams<{ id: string }>();

    // Hook for navigation (programmatic route changes)
    const navigate = useNavigate();

    // Custom hooks to manage modals for editing and confirming deletion
    const {isOpen: showEditModal, open: openEditModal, close: closeEditModal} = useModal();
    const {isOpen: showConfirmDeleteModal, open: openConfirmDelete, close: closeConfirmDelete} = useModal();

    // Convert id from string to number (or undefined if no id is present)
    const sampleId = id ? Number(id) : undefined;

    // API hook to fetch, store, and handle loading/error states for the BioSample
    const sampleApi = useApi<BioSample>();

    // API hook to handle updating a BioSample
    // On success, update local data and close the edit modal
    const updateApi = useApi<BioSample>({
        onSuccess: (updatedSample) => {
            sampleApi.setData(updatedSample);
            closeEditModal();
        }
    });

    // API hook to handle deleting a BioSample
    // On success, navigate back to the list of biosamples
    const deleteApi = useApi<void>({
        onSuccess: () => navigate('/biosamples')
    });

    // Effect runs on component mount or when sampleId changes
    // It triggers the API call to fetch the BioSample by ID
    useEffect(() => {
        if (!sampleId) return; // If no ID is available, do nothing
        sampleApi.setData(null);
        sampleApi.execute(() => fetchBioSampleById(sampleId));
    }, [sampleId]);

    // Handler to navigate back to the list of biosamples
    const handleGoBack = () => navigate('/biosamples');

    // Handler for submitting edited BioSample data
    // Only proceeds if current data is loaded
    const handleEdit = async (updatedData: BioSampleCreate) => {
        const currentData = sampleApi.data;
        if (!currentData) return;
        await updateApi.execute(() => updateBioSample(currentData.id, updatedData));
    };

    // Handler to open the confirm delete modal
    // Only if sample data exists
    const handleDeleteSample = () => {
        if (!sampleApi.data) return;
        openConfirmDelete();
    };

    // Confirm deletion handler - executes delete API call
    const confirmDelete = async () => {
        if (!sampleApi.data) return;
        await deleteApi.execute(() => deleteBioSample(sampleApi.data!.id));
    };

    // Show loading UI while fetching data
    if (sampleApi.loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-beige">
                <div className="text-gray-600">Loading sample...</div>
            </div>
        );
    }

    // Show error or "not found" message if there's an error or no data after loading
    if (sampleApi.error || !sampleApi.data) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-beige">
                <div className="text-center">
                    <div className="text-red-600 mb-4">{sampleApi.error || 'Sample not found'}</div>
                    <button
                        onClick={handleGoBack}
                        className="text-green-600 hover:text-green-700 underline"
                    >
                        Go back to list
                    </button>
                </div>
            </div>
        );
    }

    // Main render of the BioSample detail page once data is loaded
    return (
        <div className="flex flex-col h-screen bg-background-beige text-gray-800 p-6 overflow-hidden space-y-4">
            {/* Header section with back button and title */}
            <header className="flex-shrink-0">
                <div className="flex items-center gap-2 mb-4">
                    <IconButton onClick={handleGoBack} title="Go Back">
                        <ArrowLeft size={18}/>
                    </IconButton>
                    <h1 className="text-2xl font-semibold text-green-900">BioSample Manager</h1>
                </div>

                {/* BioSample details component with edit and delete actions */}
                <BioSampleDetail
                    sample={sampleApi.data}
                    onEditClick={openEditModal}
                    onDeleteClick={handleDeleteSample}
                />
            </header>

            {/* Comments section associated with this BioSample */}
            <main className="flex-1 bg-white p-6 rounded-xl shadow-md overflow-hidden">
                <CommentsSection bioSampleId={sampleApi.data.id}/>
            </main>

            {/* Modal for confirming deletion of the BioSample */}
            <ConfirmModal
                isOpen={showConfirmDeleteModal}
                onClose={closeConfirmDelete}
                onConfirm={confirmDelete}
                message={`Are you sure you want to delete the sample?`}
                title="Confirm Delete"
                isLoading={deleteApi.loading}
            />

            {/* Modal for editing the BioSample */}
            <BioSampleModal
                isOpen={showEditModal}
                onClose={closeEditModal}
                onSubmit={handleEdit}
                initialData={sampleApi.data}
                title="Edit BioSample"
            />
        </div>
    );
}
