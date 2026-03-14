import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { useAdmin } from '@/context/AdminContext';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminLayout = () => {
  const { isAuthenticated, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        {/* min-w-0 prevents flex items from overflowing their container on small screens */}
        <div className="flex-1 flex flex-col min-w-0"> 
          
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              {/* Hide search on very small screens to keep header clean */}
              <div className="relative w-full max-w-sm hidden sm:block"> 
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10 w-full bg-muted/50 border-transparent focus-visible:bg-background" />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {/* Notification dot indicator */}
                <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full border-2 border-card" />
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-auto bg-muted/10">
            {/* Center the content and restrict max width for ultra-wide screens */}
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
          
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;