// config/navigation.config.ts
import {
  User,
  Heart,
  Settings,
  CreditCard,
  Bell,
  HelpCircle,
  Briefcase,
  ShoppingBag,
  TrendingUp,
  Edit,
  FileText,
  BarChart3,
  Wallet,
  Star,
  Package,
  ClipboardList,
  CheckCircle,
  Clock,
  ListTodo,
} from "lucide-react";
import { NavigationLink } from "./ProfNavigationLinksTypes";
import { UserRole } from "@/types/base.types";

export const UNIFIED_NAVIGATION_CONFIG: NavigationLink[] = [
  {
    id: "profile",
    label: "Dashboard",
    icon: User,
    href: "/profile",
    roles: [UserRole.CUSTOMER, UserRole.PROVIDER],
    children: [
      {
        id: "profile-view",
        label: "My Profile",
        icon: User,
        href: "/profile",
        roles: [UserRole.CUSTOMER, UserRole.PROVIDER],
      },
      {
        id: "profile-edit",
        label: "Update Profile",
        icon: Edit,
        href: "/profile/edit",
        roles: [UserRole.CUSTOMER, UserRole.PROVIDER],
      },
    ],
  },
  {
    id: "bookings",
    label: "My Bookings",
    icon: ShoppingBag,
    href: "/client/bookings",
    roles: [UserRole.CUSTOMER],
    children: [
      {
        id: "client-bookings",
        label: "Active Orders",
        icon: Package,
        href: "/client/bookings",
        roles: [UserRole.CUSTOMER],
      },
      {
        id: "client-history",
        label: "Completed Orders",
        icon: FileText,
        href: "/client/bookings/history",
        roles: [UserRole.CUSTOMER],
      },
    ],
  },
  {
    id: "tasks-customer",
    label: "Tasks",
    icon: ClipboardList,
    href: "/client/tasks",
    roles: [UserRole.CUSTOMER],
    children: [
      {
        id: "my-tasks",
        label: "Posted",
        icon: ListTodo,
        href: "/client/tasks/posted",
        roles: [UserRole.CUSTOMER],
      },
      {
        id: "tasks-history",
        label: "History",
        icon: Clock,
        href: "/client/tasks/history",
        roles: [UserRole.CUSTOMER],
      },
    ],
  },
  {
    id: "favorites",
    label: "Favorites",
    icon: Heart,
    href: "/favorites",
    roles: [UserRole.CUSTOMER],
  },
  {
    id: "payment",
    label: "Payment Methods",
    icon: CreditCard,
    href: "/payment",
    roles: [UserRole.CUSTOMER],
  },
  {
    id: "services",
    label: "My Services",
    icon: Briefcase,
    href: "/provider/services",
    roles: [UserRole.PROVIDER],
    children: [
      {
        id: "services-manage",
        label: "Manage Services",
        icon: Briefcase,
        href: "/provider/services",
        roles: [UserRole.PROVIDER],
      },
      {
        id: "services-create",
        label: "Create Service",
        icon: Edit,
        href: "/provider/services/create",
        roles: [UserRole.PROVIDER],
      },
    ],
  },
  {
    id: "tasks-provider",
    label: "Tasks",
    icon: ClipboardList,
    href: "/provider/tasks",
    roles: [UserRole.PROVIDER],
    children: [
      {
        id: "tasks-available",
        label: "Task Pool",
        icon: ListTodo,
        href: "/provider/tasks/available",
        roles: [UserRole.PROVIDER],
      },
      {
        id: "tasks-requested",
        label: "Requests",
        icon: Bell,
        href: "/provider/tasks/requested",
        roles: [UserRole.PROVIDER],
      },
      {
        id: "tasks-matched",
        label: "Matched History",
        icon: CheckCircle,
        href: "/provider/tasks/matched",
        roles: [UserRole.PROVIDER],
      },
      {
        id: "booked-tasks",
        label: "Bookings",
        icon: Package,
        href: "/provider/bookings",
        roles: [UserRole.PROVIDER],
      },
    ],
  },
  {
    id: "dashboard",
    label: "Business Dashboard",
    icon: TrendingUp,
    href: "/dashboard",
    roles: [UserRole.PROVIDER],
    children: [
      {
        id: "dashboard-overview",
        label: "Overview",
        icon: BarChart3,
        href: "/dashboard/overview",
        roles: [UserRole.PROVIDER],
      },
      {
        id: "dashboard-earnings",
        label: "Earnings",
        icon: Wallet,
        href: "/dashboard/earnings",
        roles: [UserRole.PROVIDER],
      },
      {
        id: "dashboard-reviews",
        label: "Reviews",
        icon: Star,
        href: "/dashboard/reviews",
        roles: [UserRole.PROVIDER],
      },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    href: "/notifications",
    roles: [UserRole.CUSTOMER, UserRole.PROVIDER],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: `${UserRole.PROVIDER ? "/settings/provider" : "/settings/client"}`,
    roles: [UserRole.CUSTOMER, UserRole.PROVIDER],
  },
  {
    id: "help",
    label: "Help & Support",
    icon: HelpCircle,
    href: "/help",
    roles: [UserRole.CUSTOMER, UserRole.PROVIDER],
  },
];

// Helper function to filter navigation by user role
export const getNavigationByRole = (role: UserRole): NavigationLink[] => {
  return UNIFIED_NAVIGATION_CONFIG.filter((link) =>
    link.roles.includes(role),
  ).map((link) => ({
    ...link,
    children: link.children?.filter((child) => child.roles.includes(role)),
  }));
};

// Helper function to get role-specific href for settings
export const getSettingsHref = (role: UserRole): string => {
  return role === UserRole.PROVIDER ? "/settings/provider" : "/settings/client";
};

// Helper function to get role-specific profile label
export const getProfileLabel = (role: UserRole): string => {
  return role === UserRole.PROVIDER ? "Provider Profile" : "Customer Profile";
};