import React from 'react';
import { NavLink } from '@/lib/react-router-dom-proxy';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  menuItems: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    active?: boolean;
  }>;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  collapsed = false,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={cn(
        "relative h-full bg-[#0a192f] border-r border-white/10 transition-all duration-300 ease-in-out flex flex-col z-30",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group",
                isActive
                  ? "bg-primary text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )
            }
          >
            <item.icon className={cn("h-5 w-5 shrink-0")} />
            <span
              className={cn(
                "font-medium whitespace-nowrap transition-all duration-300",
                collapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto"
              )}
            >
              {item.label}
            </span>
            {!collapsed && item.active && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 hidden md:block">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-5 w-5" />
              <span className="text-xs uppercase tracking-wider font-semibold">Recolher</span>
            </div>
          )}
        </Button>
      </div>
    </aside>
  );
};
