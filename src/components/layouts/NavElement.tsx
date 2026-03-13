import { Home, Package, Grid3X3, Bell, Info } from "lucide-react";

// Types
export interface NavigationItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
  children?: NavigationItem[];
}

// Navigation configuration
export const baseNavigationItems: NavigationItem[] = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Find Services",
    href: "/services",
    icon: <Package className="h-4 w-4" />,
    children: [
      {
        title: "All Services",
        href: "/services",
        description: "Browse all available services",
        icon: <Grid3X3 className="h-4 w-4" />,
      },
      {
        title: "Popular Services",
        href: "/services/popular",
        description: "Most requested services",
        icon: <Package className="h-4 w-4" />,
        badge: "Hot",
      },
      {
        title: "Emergency Services",
        href: "/services/emergency",
        description: "Urgent assistance available 24/7",
        icon: <Bell className="h-4 w-4" />,
        badge: "24/7",
      },
    ],
  },
  {
    title: "How It Works",
    href: "/how-it-works",
    icon: <Info className="h-4 w-4" />,
    children: [
      {
        title: "Getting Started",
        href: "/how-it-works",
        description: "Learn how our platform works",
        icon: <Info className="h-4 w-4" />,
      },
      {
        title: "Pricing",
        href: "/how-it-works/pricing",
        description: "Transparent pricing structure",
      },
      {
        title: "FAQ",
        href: "/how-it-works/faq",
        description: "Frequently asked questions",
      },
    ],
  },
  {
    title: "About",
    href: "/about-us",
    children: [
      {
        title: "Our Story",
        href: "/about-us/story",
        description: "Learn about our journey",
      },
      {
        title: "Team",
        href: "/about-us/team",
        description: "Meet our amazing team",
      },
      {
        title: "Contact",
        href: "/about-us/our-contacts",
        description: "Get in touch with us",
      },
    ],
  },
];
