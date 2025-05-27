import apiClient from './apiClient';
import type { Comment, CommentCreate, PaginatedResponse } from '../types';

/**
 * Fetches paginated comments for a specific bio sample.
 * @param bioSampleId ID of the bio sample
 * @param offset Number of comments to skip (default 0)
 * @param limit Number of comments to fetch (default 10)
 * @returns PaginatedResponse containing Comment items
 */
export const fetchComments = async (
  bioSampleId: number,
  offset: number = 0,
  limit: number = 10
): Promise<PaginatedResponse<Comment>> => {
  const res = await apiClient.get(`/comments/${bioSampleId}`, {
    params: { offset, limit },
  });
  return res.data;
};

/**
 * Creates a new comment linked to a specific bio sample.
 * @param bioSampleId ID of the bio sample the comment belongs to
 * @param data Comment data (excluding bioSampleId)
 * @returns The created Comment object
 */
export const createComment = async (
  bioSampleId: number,
  data: CommentCreate  // bioSampleId is provided in URL, not in data
): Promise<Comment> => {
  const res = await apiClient.post(`/comments/${bioSampleId}`, data);
  return res.data;
};
