// import {
//   Tag,
//   Users,
//   Settings,
//   Bookmark,
//   SquarePen,
//   LayoutGrid,
//   LucideIcon,
// } from "lucide-react";

// export function getMenuList(pathname) {
//   return [
//     {
//       groupLabel: "",
//       menus: [
//         {
//           href: "/dashboard",
//           label: "Dashboard",
//           icon: LayoutGrid,
//           submenus: [],
//         },
//       ],
//     },
//     {
//       groupLabel: "Contents",
//       menus: [
//         {
//           href: "",
//           label: "Posts",
//           icon: SquarePen,
//           submenus: [
//             {
//               href: "/posts",
//               label: "All Posts",
//             },
//             {
//               href: "/posts/new",
//               label: "New Post",
//             },
//           ],
//         },
//         {
//           href: "/categories",
//           label: "Categories",
//           icon: Bookmark,
//         },
//         {
//           href: "/tags",
//           label: "Tags",
//           icon: Tag,
//         },
//       ],
//     },
//     {
//       groupLabel: "Settings",
//       menus: [
//         {
//           href: "/users",
//           label: "Users",
//           icon: Users,
//         },
//         {
//           href: "/account",
//           label: "Account",
//           icon: Settings,
//         },
//       ],
//     },
//   ];
// }


import useAuthStore from "@/hooks/useAuth";
import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  UserRoundCheck,
  UserPlus
} from "lucide-react";


// Menu data with allowed roles
const menuGroups = [
  {
    groupLabel: "",
    menus: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutGrid,
        roles: ["admin", "editor", "viewer"],
        submenus: []
      }
    ]
  },
  {
    groupLabel: "Contents",
    menus: [
      {
        href: "",
        label: "Posts",
        icon: SquarePen,
        roles: ["admin", "editor"],
        submenus: [
          {
            href: "/posts",
            label: "All Posts"
          },
          {
            href: "/posts/new",
            label: "New Post"
          }
        ]
      },
      {
        href: "/categories",
        label: "Categories",
        icon: Bookmark,
        roles: ["admin", "editor"]
      },
      {
        href: "/tags",
        label: "Tags",
        icon: Tag,
        roles: ["admin"]
      }
    ]
  },
  {
    groupLabel: "Employees",
    menus: [
      {
        href: "/employees",
        label: "All Employees",
        icon: Users,
        roles: ["admin","viewer"]
      },
      {
        href: "/employees/new",
        label: "Add New Employee",
        icon: UserPlus ,      
        roles: ["admin", "editor", "viewer"]
      }
    ]
  },
  {
    groupLabel: "Settings",
    menus: [
      {
        href: "/users",
        label: "Users",
        icon: Users,
        roles: ["admin"]
      },
      {
        href: "/account",
        label: "Account",
        icon: Settings,
        roles: ["admin", "editor", "viewer"]
      }
    ]
  }
];

// Function to get menus based on user role
export function getMenuList(pathname) {
  const { user } = useAuthStore.getState(); // zustand se current user

  const role = user?.role || "viewer"; // default viewer agar kuch na ho

  // Role ke hisaab se menus filter
  const filteredMenus = menuGroups.map((group) => ({
    groupLabel: group.groupLabel,
    menus: group.menus.filter((menu) => menu.roles.includes(role))
  })).filter((group) => group.menus.length > 0); // Empty group hata dega

  return filteredMenus;
}
