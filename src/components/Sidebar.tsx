

import {
Bookmark,
Bot,
Home,
MessageSquare,
MessageSquareCheck,
Newspaper,
Store,
Tag,
Trophy,
User,
X,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
isOpen: boolean;
onClose: () => void;
}

const navigationItems = [
{ name: "Home", href: "/", icon: Home },
{ name: "Questions", href: `#questions`, icon: MessageSquareCheck },
{ name: "AI Assist", href: "#ai-assist", icon: Bot, badge: "Labs" },
{ name: "Tags", href: "#tags", icon: Tag },
{ name: "Users", href: "/users", icon: User },
{ name: "Challenges", href: "#challenges", icon: Trophy },
{ name: "Articles", href: "#articles", icon: Newspaper },
{ name: "Chat", href: "#chat", icon: MessageSquare },
{ name: "Saved", href: "#saves", icon: Bookmark },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
const pathname = usePathname();

return (
<>
{/* Mobile backdrop */}
<div
onClick={onClose}
aria-hidden="true"
className={`fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
/>


  {/* Sidebar */}
  <aside
    aria-label="Main sidebar"
    className={`fixed left-0 top-16 z-50 flex h-[calc(100dvh-4rem)] w-64 flex-col border-r border-gray-200 bg-white px-4 py-6 text-gray-700 shadow-xl transition-transform duration-300 ease-in-out md:sticky md:top-16 md:z-30 md:h-[calc(100dvh-4rem)] md:shrink-0 md:translate-x-0 md:shadow-none ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    {/* Sidebar heading */}
    <div className="mb-6 flex items-center justify-between px-3">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
        Workspace
      </p>

      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 md:hidden"
        aria-label="Close sidebar"
      >
        <X size={18} />
      </button>
    </div>

    {/* Navigation */}
    <nav className="flex-1 overflow-y-auto">
      <ul className="space-y-1.5">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href 
              
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-gray-700"
                  }`}
                />

                <span className="flex-1">{item.name}</span>

                {item.badge && (
                  <Badge className="border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 hover:bg-indigo-100">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>

    {/* Community card */}
    <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Store size={17} className="text-indigo-600" />

        <span className="text-sm font-semibold text-gray-900">
          Your Community
        </span>
      </div>

      <p className="text-xs leading-5 text-gray-500">
        Learn, share knowledge, and connect with developers.
      </p>
    </div>
  </aside>
</>


);
};

export default Sidebar;
