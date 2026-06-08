import {
  Compass,
  FileStack,
  FileText,
  Headphones,
  Home,
  Package,
  Paperclip,
  Receipt,
  ShoppingCart,
} from "lucide-react";

export const MAIN_NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/my-items", label: "My items", icon: FileStack },
] as const;

export const RECENT_NAV = [
  {
    href: "/financial-requests",
    label: "الطلبات المالية",
    badge: "FR",
    icon: Receipt,
  },
  {
    href: "/invoices",
    label: "الفواتير",
    badge: "INV",
    icon: FileText,
  },
  {
    href: "/add-file-request",
    label: "طلب إضافة ملف",
    badge: "AF",
    icon: Paperclip,
  },
  {
    href: "/daily-orders",
    label: "الطلبات اليومية",
    badge: "DO",
    sublabel: "Daily orders",
    icon: Package,
  },
  {
    href: "/support",
    label: "Support",
    badge: "SUP",
    sublabel: "الدعم",
    icon: Headphones,
  },
  {
    href: "/sales-requests",
    label: "طلبات المبيعات",
    badge: "SR",
    icon: ShoppingCart,
  },
  {
    href: "/explore",
    label: "Explore",
    badge: "",
    icon: Compass,
  },
] as const;

export const EXPLORE_MODULES = [
  {
    href: "/financial-requests",
    titleEn: "Financial Requests",
    titleAr: "الطلبات المالية",
    code: "FR",
    description: "Payment vouchers, transfers & approvals",
    color: "from-blue-500 to-indigo-600",
  },
  {
    href: "/invoices",
    titleEn: "Invoices",
    titleAr: "الفواتير",
    code: "INV",
    description: "Supplier invoices & finance approval",
    color: "from-emerald-500 to-teal-600",
  },
  {
    href: "/add-file-request",
    titleEn: "Add File Request",
    titleAr: "طلب إضافة ملف",
    code: "AF",
    description: "Internal document upload requests",
    color: "from-violet-500 to-purple-600",
  },
  {
    href: "/daily-orders",
    titleEn: "Daily Orders",
    titleAr: "الطلبات اليومية",
    code: "DO",
    description: "Branch daily supply orders",
    color: "from-amber-500 to-orange-600",
  },
  {
    href: "/support",
    titleEn: "Support",
    titleAr: "الدعم",
    code: "SUP",
    description: "Internal support tickets",
    color: "from-rose-500 to-pink-600",
  },
  {
    href: "/sales-requests",
    titleEn: "Sales Requests",
    titleAr: "طلبات المبيعات",
    code: "SR",
    description: "Customer & branch sales orders",
    color: "from-cyan-500 to-blue-600",
  },
] as const;

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
