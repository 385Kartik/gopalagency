import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  BarChart3, Package, ShoppingCart, Users, Truck,
  Settings, LogOut, Info, PhoneCall
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const adminMenuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: BarChart3 },
  { title: 'Products', url: '/admin/products', icon: Package },
  { title: 'Orders', url: '/admin/orders', icon: ShoppingCart },
  { title: 'Customers', url: '/admin/customers', icon: Users },
  { title: 'Delivery', url: '/admin/delivery', icon: Truck },
  { title: 'About Section', url: '/admin/about', icon: Info },
  { title: 'Contact Us', url: '/admin/contact', icon: PhoneCall },
  { title: 'Settings', url: '/admin/settings', icon: Settings }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have securely logged out of the admin panel." });
      navigate('/admin/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center w-full transition-colors duration-200 ${isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm rounded-md" 
      : "text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md"}`;

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        
        {/* Brand Header (Pinned to top) */}
        <div className="p-4 border-b border-sidebar-border shrink-0">
          {!isCollapsed ? (
            <div>
              <h2 className="font-bold text-xl text-sidebar-foreground tracking-tight">Shree Gopal</h2>
              <p className="text-xs text-sidebar-foreground/60 uppercase tracking-wider mt-0.5 font-medium">Admin Panel</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-sm">SG</span>
              </div>
            </div>
          )}
        </div>

        {/* Admin Info Card */}
        {!isCollapsed && admin && (
          <div className="p-4 shrink-0">
            <div className="flex items-center space-x-3 bg-sidebar-accent/30 border border-sidebar-border p-2.5 rounded-xl">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-inner shrink-0">
                <span className="text-primary-foreground text-sm font-bold">
                  {(admin.email?.charAt(0) || 'A').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {admin.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {admin.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links (Scrollable area) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase text-sidebar-foreground/50 tracking-wider mb-2">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink to={item.url} end className={getNavClass}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!isCollapsed && <span className="ml-3 truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Logout Button (Pinned to bottom) */}
        <div className="p-4 border-t border-sidebar-border shrink-0 mt-auto bg-sidebar">
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            onClick={handleLogout}
            className={`w-full text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ${!isCollapsed ? 'justify-start px-3' : ''}`}
            title="Logout"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
          </Button>
        </div>

      </SidebarContent>
    </Sidebar>
  );
}