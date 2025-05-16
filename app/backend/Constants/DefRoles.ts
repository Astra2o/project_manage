export const ROLE_PERMISSIONS: Record<string, string[]> = {
    developer: ["update_task", "view_task","view_team", "view_projects"],
    uiux: ["read_employee", "update_designs", "view_projects"],
    seo: ["read_employee", "view_analytics"],
    admin: [
      "read_employee",
      "add_employee",
      "update_employee",
      "delete_employee",
      "manage_roles",
      "leave_management",
      "view_reports",
    ],
    teamLeader:['view_team',"manage_team","asign_task"],
    hr: ["read_employee", "leave_management", "add_employee"],
    manager: ["read_employee", "update_employee", "view_reports", "manage_projects"],
  };
  