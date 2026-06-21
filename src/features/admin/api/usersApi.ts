import { apiClient } from "@/shared/api/apiclient";
import { ApiEndpoints } from "@/shared/api/ApiEndpoints";
import { UserSummaryDto, UserActionResult } from "../types";

export const usersApi = {
  GetAllUsers: async (): Promise<UserSummaryDto[]> => {
    const response = await apiClient.get<UserSummaryDto[]>(
      ApiEndpoints.User.GET_ALL
    );
    return response.data;
  },

  GetUsersByRole: async (role: string): Promise<UserSummaryDto[]> => {
    const response = await apiClient.get<UserSummaryDto[]>(
      ApiEndpoints.User.GET_BY_ROLE(role)
    );
    return response.data;
  },

  GetUserById: async (id: string): Promise<UserSummaryDto> => {
    const response = await apiClient.get<UserSummaryDto>(
      ApiEndpoints.User.GET_BY_ID(id)
    );
    return response.data;
  },

  PromoteToLibrarian: async (id: string): Promise<UserActionResult> => {
    const response = await apiClient.post<UserActionResult>(
      ApiEndpoints.User.PROMOTE_TO_LIBRARIAN(id)
    );
    return response.data;
  },

  DemoteToMember: async (id: string): Promise<UserActionResult> => {
    const response = await apiClient.post<UserActionResult>(
      ApiEndpoints.User.DEMOTE_TO_MEMBER(id)
    );
    return response.data;
  },

  Deactivate: async (id: string): Promise<UserActionResult> => {
    const response = await apiClient.post<UserActionResult>(
      ApiEndpoints.User.DEACTIVATE(id)
    );
    return response.data;
  },

  Reactivate: async (id: string): Promise<UserActionResult> => {
    const response = await apiClient.post<UserActionResult>(
      ApiEndpoints.User.REACTIVATE(id)
    );
    return response.data;
  },
};
