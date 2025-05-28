import {useEffect} from 'react';
import {useApi} from '../../hooks/useApi';
import {usePagination} from '../../hooks/usePagination';
import {fetchComments, createComment} from '../../api/comments';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import Pagination from '../UI/Pagination';
import type {Comment, CommentCreate, PaginatedResponse} from '../../types';


interface CommentFormData {
    content: string;
    author: string;
}

interface CommentsSectionProps {
    bioSampleId: number;             // ID of the biological sample for which comments are loaded
    commentsPerPage?: number;        // Optional number of comments to show per page, default is 3
}

export default function CommentsSection({bioSampleId, commentsPerPage = 3}: CommentsSectionProps) {
    // Pagination hook manages current page, items per page, offsets, and total count
    const pagination = usePagination({itemsPerPage: commentsPerPage});

    // API hook to manage fetching comments (data, loading, error)
    const commentsApi = useApi<PaginatedResponse<Comment>>({
        onSuccess: (data) => {
            pagination.setTotalCount(data.totalCount);
        },
        onError: (errorMessage) => {
            console.error('Failed to load comments:', errorMessage);
        }
    });

    // API hook to manage creating new comments
    const createApi = useApi<Comment>({
        onError: (errorMessage) => {
            console.error('Failed to add comment:', errorMessage);
        }
    });

    // Load comments for current bioSampleId and current pagination state
    const loadComments = async (): Promise<void> => {
        await commentsApi.execute(() =>
            fetchComments(bioSampleId, pagination.offset, pagination.itemsPerPage));
    };

    // useEffect triggers loading comments on:
    // - bioSampleId change (new sample)
    // - currentPage or itemsPerPage change (pagination change)
    useEffect(() => {
        loadComments();
    }, [bioSampleId, pagination.currentPage, pagination.itemsPerPage]);

    // Function to handle adding a new comment
    const addComment = async (data: CommentFormData) => {
        try {
            // Call API to create new comment (casting data to CommentCreate type)
            await createApi.execute(() => createComment(bioSampleId, data as CommentCreate));

            // After adding comment, reset to first page (to show new comment)
            pagination.goToFirstPage();

            // Reload comments to reflect the newly added comment
            await loadComments();
        } catch (err) {
            // Log error if comment creation fails
            console.error('Failed to add comment:', err);
        }
    };

    // If there was an error loading comments, display error message instead of comments section
    if (commentsApi.error) {
        return (
            <div className="flex flex-col h-full gap-4">
                <h3 className="text-xl font-semibold text-green-900">Comments</h3>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-600 mb-2">Failed to load comments</div>
                        <div className="text-sm text-gray-500">{commentsApi.error.toString()}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full gap-4">
            <h3 className="text-xl font-semibold text-green-900">Comments</h3>

            {/* Comment submission form */}
            <div className="flex-shrink-0">
                <CommentForm onSubmit={addComment}/>
            </div>

            {/* Comment list and pagination */}
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Scrollable comment list area */}
                <div className="flex-1 overflow-auto pr-1">
                    {commentsApi.loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-gray-500">Loading comments...</div>
                        </div>
                    ) : (
                        // Display list of comments or empty array if none
                        <CommentList comments={commentsApi.data?.results || []}/>
                    )}
                </div>

                {/* Pagination controls, shown only if more than one page */}
                {pagination.totalPages > 1 && (
                    <div className="mt-4 flex-shrink-0">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={pagination.setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
