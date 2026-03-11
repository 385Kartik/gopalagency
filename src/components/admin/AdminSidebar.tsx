import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck,
  Settings,
  LogOut,
  Info,
  PhoneCall
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';

const adminMenuItems = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: BarChart3
  },
  {
    title: 'Products',
    url: '/admin/products',
    icon: Package
  },
  {
    title: 'Orders',
    url: '/admin/orders',
    icon: ShoppingCart
  },
  {
    title: 'Customers',
    url: '/admin/customers',
    icon: Users
  },
  {
    title: 'Delivery',
    url: '/admin/delivery',
    icon: Truck
  },
  {
    title: 'About Section',
    url: '/admin/about',
    icon: Info
  },
  {
    title: 'Contact Us',
    url: '/admin/contact',
    icon: PhoneCall
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const { admin, logout } = useAdmin();
  const location = useLocation();
  
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Brand */}
        <div className="p-4 border-b border-sidebar-border">
          {!isCollapsed ? (
            <div>
              <h2 className="font-bold text-lg text-sidebar-foreground">Shree Gopal</h2>
              <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SG</span>
              </div>
            </div>
          )}
        </div>

        {/* Admin Info */}
        {!isCollapsed && admin && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-semibold">
                  {(admin.email?.charAt(0) || 'A').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {admin.email || 'Admin'}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  Admin
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            onClick={logout}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}