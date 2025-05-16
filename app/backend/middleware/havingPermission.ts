import Employee from "../models/Employee";

// Type for the function parameters
interface PermissionOptions {
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

// Type for the function's return value
interface PermissionResult {
  success: boolean;
  message?: string;
  error?: string;
}

// Main function type-safe
export const havingPermission = async (
  userId: string,
  { requiredRoles = [], requiredPermissions = [] }: PermissionOptions
): Promise<PermissionResult> => {
  try {
    const user = await Employee.findById(userId).select("permissions role position");

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const hasPermission = requiredPermissions.some((perm) =>
      user.permissions.includes(perm)
    );

    const hasRole =
      requiredRoles.includes(user.role) ||
      requiredRoles.includes(user.position) ||
      ["admin", "manager", "hr"].includes(user.role);

    return hasPermission || hasRole
      ? { success: true }
      : { success: false, message: "Access denied" };
  } catch (error: any) {
    return {
      success: false,
      message: "Error checking permissions",
      error: error.message,
    };
  }
};
