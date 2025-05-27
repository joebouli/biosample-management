import apiClient from './apiClient';
import type { BioSample, BioSampleCreate, PaginatedResponse } from '../types';

/**
 * Fetches a paginated list of bio samples with limit and offset.
 * @param limit Number of items per page (default 10)
 * @param offset Number of items to skip (default 0)
 * @returns PaginatedResponse containing BioSample items
 */
export const fetchBioSamples = async (
  limit = 10,
  offset = 0
): Promise<PaginatedResponse<BioSample>> => {
  const res = await apiClient.get('/biosamples', {
    params: { limit, offset },
  });
  return res.data;
};

/**
 * Fetches the list of operator names.
 * @returns Array of operator names as strings
 */
export const fetchOperators = async (): Promise<string[]> => {
  const res = await apiClient.get('/operators');
  return res.data;
};

/**
 * Fetches the list of sample type names.
 * @returns Array of sample type names as strings
 */
export const fetchSampleTypes = async (): Promise<string[]> => {
  const res = await apiClient.get('/sample-types');
  return res.data;
};

/**
 * Fetches a single bio sample by its ID.
 * @param id BioSample ID
 * @returns BioSample object
 */
export const fetchBioSampleById = async (id: number): Promise<BioSample> => {
  const res = await apiClient.get(`/biosamples/${id}`);
  return res.data;
};

/**
 * Creates a new bio sample.
 * @param data Data for the new BioSample
 * @returns The created BioSample
 */
export const createBioSample = async (data: BioSampleCreate): Promise<BioSample> => {
  const res = await apiClient.post('/biosamples/', data);
  return res.data;
};

/**
 * Updates an existing bio sample by ID.
 * @param id BioSample ID to update
 * @param data Updated data for the BioSample
 * @returns The updated BioSample
 */
export const updateBioSample = async (id: number, data: BioSampleCreate): Promise<BioSample> => {
  const res = await apiClient.put(`/biosamples/${id}`, data);
  return res.data;
};

/**
 * Deletes a bio sample by ID.
 * @param id BioSample ID to delete
 */
export const deleteBioSample = async (id: number): Promise<void> => {
  await apiClient.delete(`/biosamples/${id}`);
};
