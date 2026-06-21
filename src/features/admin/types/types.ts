import type { UserRole } from "@/features/auth/types";

/**
 * Mirrors UsersController.UserSummaryDto:
 * public record UserSummaryDto(string Id, string FullName, string Email, bool IsActive, DateTime CreatedAt, string Role);
 */
export interface UserSummaryDto {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  role: UserRole | "Member";
}

/**
 * Mirrors the { Success, Message } / { Success, Errors } shapes returned by
 * the promote/demote/deactivate/reactivate endpoints. Errors is only present
 * on failure, Message only on success — both are optional to reflect that.
 */
export interface UserActionResult {
  success: boolean;
  message?: string;
  errors?: string[];
}
