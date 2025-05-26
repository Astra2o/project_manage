
// Type for the function parameters

import Employee from "../models/Employee";

// Main function type-safe
export const havingPermission = async (
  userId,
  { requiredRoles = [], requiredPermissions = [] }
) => {
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
      ["admin", "hr"].includes(user.role);

    return hasPermission || hasRole
      ? { success: true }
      : { success: false, message: "Access denied" };
  } catch (error) {
    return {
      success: false,
      message: "Error checking permissions",
      error: error.message,
    };
  }
};
