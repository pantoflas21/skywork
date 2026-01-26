import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  user?: User;
  menuItems: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    active?: boolean;
  }>;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  menuItems,
  children,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Handle window resizing to auto-collapse sidebar on smaller desktop screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header user={user} onToggleSidebar={toggleMobileSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            menuItems={menuItems}
            collapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300",
            isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={toggleMobileSidebar}
        >
          <div
            className={cn(
              "fixed inset-y-0 left-0 w-64 bg-[#0a192f] transition-transform duration-300 transform",
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar 
              menuItems={menuItems} 
              collapsed={false} 
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto relative">
          <div className="container mx-auto px-4 py-8 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
