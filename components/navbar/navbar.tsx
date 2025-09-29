'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, User, LogOut, Menu, LayoutDashboard, FileCheck, UserCheck, Building2, Users, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/components/providers/auth-provider';
import { useState } from 'react';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard, 
    badge: null
  },
  { 
    name: 'QA Reviews', 
    href: '/qa-reviews', 
    icon: FileCheck, 
    badge: '12'
  },
  { 
    name: 'Reviewer', 
    href: '/reviewer', 
    icon: UserCheck, 
    badge: '3'
  },
  { 
    name: 'Member Firm', 
    href: '/member-firm', 
    icon: Building2, 
    badge: null
  },
  { 
    name: 'Technical Director', 
    href: '/technical-director', 
    icon: Users, 
    badge: '5'
  },
  { 
    name: 'Admin', 
    href: '/admin', 
    icon: Shield, 
    badge: null
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="group">
              <div className="flex items-center space-x-2 group-hover:opacity-80 transition-opacity duration-200">
                <Logo size="md" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                    isActive 
                      ? `bg-primary/10 text-primary` 
                      : 'text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        'h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs',
                        isActive 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-primary/10 text-primary'
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1">
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex h-8 w-8"
            >
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-white font-medium text-xs">
                      {user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56" 
                align="end" 
                forceMount
              >
                <div className="px-3 py-2 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white font-medium">
                        {user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.role || 'Administrator'}
                      </p>
                    </div>
                  </div>
                </div>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-3">
            <div className="grid grid-cols-1 gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          'h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs',
                          isActive 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-primary/10 text-primary'
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
              <button
                className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-left text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}