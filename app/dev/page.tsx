'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, ExternalLink, Database, Users, FileText, FileSpreadsheet } from 'lucide-react';

export default function DevPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allScreens = [
    // Core Application
    { name: 'Home', path: '/', description: 'Landing page with hero section', category: 'core', status: 'working' },
    { name: 'Dashboard', path: '/dashboard', description: 'Main dashboard with quick actions', category: 'core', status: 'working' },
    { name: 'Login', path: '/login', description: 'Authentication with SSO option', category: 'core', status: 'working' },
    { name: '404 Page', path: '/not-found', description: 'Custom not found page', category: 'core', status: 'working' },
    
    // User Role Dashboards
    { name: 'Admin Dashboard', path: '/admin', description: 'System administration & user management', category: 'roles', status: 'working', role: 'admin' },
    { name: 'CEO Dashboard', path: '/ceo', description: 'Executive oversight & approvals', category: 'roles', status: 'working', role: 'ceo' },
    { name: 'Technical Director', path: '/technical-director', description: 'Technical reviews & assignments', category: 'roles', status: 'working', role: 'tech_director' },
    { name: 'Reviewer Portal', path: '/reviewer', description: 'File reviews & feedback', category: 'roles', status: 'working', role: 'reviewer' },
    { name: 'Member Firm Portal', path: '/member-firm', description: 'File submission & tracking', category: 'roles', status: 'working', role: 'member_firm' },
    
    // QA Reviews Section
    { name: 'QA Reviews Main', path: '/qa-reviews', description: 'Main reviews table with filters and dialogs', category: 'qa', status: 'working' },
    
    // File Management
    { name: 'File Upload', path: '/member-firm', description: 'Excel file upload with validation', category: 'files', status: 'working' },
    { name: 'File Review', path: '/reviewer', description: 'Review interface with scoring', category: 'files', status: 'working' },
    { name: 'File Download', path: '/qa-reviews', description: 'Download reviewed files', category: 'files', status: 'working' },
  ];

  const categories = {
    all: { label: 'All Screens', icon: Code, count: allScreens.length },
    core: { label: 'Core Application', icon: FileText, count: allScreens.filter(s => s.category === 'core').length },
    roles: { label: 'User Roles', icon: Users, count: allScreens.filter(s => s.category === 'roles').length },
    qa: { label: 'QA Reviews', icon: FileText, count: allScreens.filter(s => s.category === 'qa').length },
    files: { label: 'File Management', icon: FileSpreadsheet, count: allScreens.filter(s => s.category === 'files').length },
  };

  const filteredScreens = selectedCategory === 'all' 
    ? allScreens 
    : allScreens.filter(screen => screen.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'broken': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'ceo': return 'bg-blue-500';
      case 'tech_director': return 'bg-purple-500';
      case 'reviewer': return 'bg-orange-500';
      case 'member_firm': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <Code className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-foreground">Development Overview</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Complete QA Review Application - All screens and features ready for development and testing
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge className="bg-green-500 text-white">
            <Database className="h-3 w-3 mr-1" />
            Production Ready
          </Badge>
          <Badge variant="secondary">
            <Users className="h-3 w-3 mr-1" />
            100+ Mock Records
          </Badge>
          <Badge variant="secondary">
            <FileText className="h-3 w-3 mr-1" />
            4 User Roles
          </Badge>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(categories).map(([key, category]) => {
          const IconComponent = category.icon;
          return (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(key)}
              className="flex items-center gap-2"
            >
              <IconComponent className="h-4 w-4" />
              {category.label}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Screens Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredScreens.map((screen) => (
          <Card key={screen.path} className="border border-white/30 bg-gradient-to-br from-slate-50 via-gray-100 to-zinc-100 backdrop-blur-md dark:from-slate-950/20 dark:via-gray-900/20 dark:to-zinc-900/20 dark:border-white/20 hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {screen.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {screen.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(screen.status)}`}></div>
                  {screen.role && (
                    <div className={`w-2 h-2 rounded-full ${getRoleColor(screen.role)}`}></div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  {screen.path}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => window.open(screen.path, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Development Information */}
      <Card className="border border-white/30 bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 backdrop-blur-md dark:from-amber-950/20 dark:via-orange-900/20 dark:to-yellow-900/20 dark:border-white/20">
        <CardHeader>
          <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
            <Code className="h-5 w-5" />
            Development Information
          </CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            Technical details and development notes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-amber-900 dark:text-amber-100">Base URL</h4>
              <code className="block p-2 bg-amber-100 dark:bg-amber-900/20 rounded text-sm">
                http://localhost:3000
              </code>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-amber-900 dark:text-amber-100">Development Server</h4>
              <code className="block p-2 bg-amber-100 dark:bg-amber-900/20 rounded text-sm">
                npm run dev
              </code>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-amber-900 dark:text-amber-100">Authentication</h4>
              <code className="block p-2 bg-amber-100 dark:bg-amber-900/20 rounded text-sm">
                Mock users available for all roles
              </code>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-amber-900 dark:text-amber-100">Mock Data</h4>
              <code className="block p-2 bg-amber-100 dark:bg-amber-900/20 rounded text-sm">
                100+ Excel files, 6 users, 5 member firms
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
