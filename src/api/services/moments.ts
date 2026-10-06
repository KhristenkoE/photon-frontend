import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  CreateMomentRequest,
  GetMomentsParams,
  Moment,
  MomentsResponse,
  UpdateMomentRequest,
} from '@/api/types/types';

export const momentsService = {
  /**
   * Get moments list
   * @param userTgId - User ID to get moments for
   * @param offset - Offset for pagination
   * @param limit - Number of items per page
   */
  async getMoments({
    userTgId,
    offset,
    limit,
  }: GetMomentsParams): Promise<MomentsResponse> {
    return apiClient.get<MomentsResponse>(ENDPOINTS.MOMENTS, {
      params: {
        userTgId,
        offset,
        limit,
      },
    });
  },

  /**
   * Get a single moment by ID
   * @param momentId - ID of the moment to get
   * @returns Moment data
   */
  async getMoment(momentId: string): Promise<Moment> {
    return apiClient.get<Moment>(ENDPOINTS.MOMENT(momentId));
  },

  /**
   * Create a new moment
   * @param data - Moment creation data
   * @returns Created moment
   */
  async createMoment(data: CreateMomentRequest): Promise<Moment> {
    return apiClient.post<Moment>(ENDPOINTS.MOMENTS, data);
  },

  /**
   * Update a moment
   * @param momentId - ID of the moment to update
   * @param data - Moment update data
   * @returns Updated moment
   */
  async updateMoment(
    momentId: string,
    data: UpdateMomentRequest,
  ): Promise<Moment> {
    return apiClient.put<Moment>(ENDPOINTS.MOMENT(momentId), data);
  },

  /**
   * Delete a moment
   * @param momentId - ID of the moment to delete
   */
  async deleteMoment(momentId: string): Promise<void> {
    return apiClient.delete<void>(ENDPOINTS.MOMENT(momentId));
  },
};
