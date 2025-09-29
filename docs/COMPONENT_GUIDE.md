# Component Usage Guide

## 🧩 Component Library Usage

This guide provides detailed examples of how to use the optimized component library in the HLB QA Tracker application.

## 📋 Table of Contents

- [Design System Components](#design-system-components)
- [Form Components](#form-components)
- [Table Components](#table-components)
- [Navigation Components](#navigation-components)
- [Status Components](#status-components)
- [Layout Components](#layout-components)
- [Performance Components](#performance-components)

## 🎨 Design System Components

### Button Components

```typescript
import { BUTTON_VARIANTS } from '@/lib/design-system';
import { Button } from '@/components/ui/button';

// Basic usage
<Button variant="default" size="md">
  Click me
</Button>

// With icon
<Button variant="glass" size="lg" className={BUTTON_VARIANTS({ variant: 'glass', size: 'lg' })}>
  <Icon className="mr-2" />
  Glass Button
</Button>

// Loading state
<Button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

### Card Components

```typescript
import { CARD_VARIANTS } from '@/lib/design-system';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Basic card
<Card className={CARD_VARIANTS({ variant: 'glass', padding: 'lg' })}>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>

// Elevated card with custom styling
<Card className={CARD_VARIANTS({ variant: 'elevated' })}>
  <CardContent className="p-8">
    <h3 className="text-xl font-bold mb-4">Important Information</h3>
    <p className="text-muted-foreground">This is elevated content</p>
  </CardContent>
</Card>
```

### Badge Components

```typescript
import { BADGE_VARIANTS } from '@/lib/design-system';
import { Badge } from '@/components/ui/badge';

// Status badges
<Badge className={BADGE_VARIANTS({ variant: 'success' })}>
  <CheckCircle className="w-3 h-3 mr-1" />
  Active
</Badge>

<Badge className={BADGE_VARIANTS({ variant: 'warning' })}>
  <AlertCircle className="w-3 h-3 mr-1" />
  Pending
</Badge>
```

## 📝 Form Components

### Form Field Factory

```typescript
import { createFormFieldConfig } from '@/lib/component-library';
import { useForm } from '@/hooks/use-optimized-hooks';

// Create form configuration
const formConfig = {
  title: 'User Registration',
  fields: [
    createFormFieldConfig('name', 'Full Name', 'text', {
      required: true,
      placeholder: 'Enter your full name',
      icon: 'User',
      validation: {
        required: true,
        minLength: 2
      }
    }),
    createFormFieldConfig('email', 'Email Address', 'email', {
      required: true,
      placeholder: 'Enter your email',
      icon: 'Mail',
      validation: {
        required: true,
        pattern: '^[^@]+@[^@]+\\.[^@]+$'
      }
    }),
    createFormFieldConfig('role', 'Role', 'select', {
      required: true,
      options: [
        { label: 'Select Role', value: '' },
        { label: 'Admin', value: 'admin' },
        { label: 'Reviewer', value: 'reviewer' }
      ],
      icon: 'Shield'
    })
  ]
};

// Use in component
const { values, errors, setValue, validate } = useForm(formConfig.fields.reduce((acc, field) => ({
  ...acc,
  [field.name]: ''
}), {}));

// Render form fields
{formConfig.fields.map(field => (
  <FormField
    key={field.name}
    config={field}
    value={values[field.name]}
    error={errors[field.name]}
    onChange={(value) => setValue(field.name, value)}
  />
))}
```

### Dynamic Form Rendering

```typescript
import { FORM_CONFIGS } from '@/lib/page-configs';

// Use predefined form configurations
const userFormConfig = FORM_CONFIGS.user;

// Render form with configuration
<UserForm config={userFormConfig} onSubmit={handleSubmit} />
```

## 📊 Table Components

### Table Configuration

```typescript
import { createTableColumnConfig, createStatusBadgeConfig } from '@/lib/component-library';
import { GenericTable } from '@/components/table/generic-table';

// Define table columns
const columns = [
  createTableColumnConfig('name', 'Name', {
    sortable: true,
    filterable: true,
    cellType: 'text'
  }),
  createTableColumnConfig('status', 'Status', {
    sortable: true,
    filterable: true,
    cellType: 'badge',
    render: (value) => createStatusBadgeConfig(value, 'qaReview')
  }),
  createTableColumnConfig('actions', 'Actions', {
    cellType: 'custom',
    width: '120px',
    align: 'center',
    render: (value, row) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>
          <Edit className="w-3 h-3" />
        </Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(row.id)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    )
  })
];

// Use in component
<GenericTable
  data={data}
  columns={columns}
  onSort={handleSort}
  onFilter={handleFilter}
  pagination={{
    page: currentPage,
    pageSize: 10,
    total: totalItems
  }}
/>
```

### Table with Filters

```typescript
import { TableHeaderWithFilters } from '@/components/ui/table-header-with-filters';
import { ENHANCED_FILTER_CONFIGS } from '@/components/ui/table-header-with-filters';

// Use predefined filter configurations
const filterConfig = ENHANCED_FILTER_CONFIGS.qaReviews;

<TableHeaderWithFilters
  title={filterConfig.title}
  description={filterConfig.description}
  searchPlaceholder={filterConfig.searchPlaceholder}
  onSearch={handleSearch}
  onFilter={handleFilter}
  onClearFilters={handleClearFilters}
  filters={filterConfig.filters}
  quickFilters={filterConfig.quickFilters}
  activeFilters={activeFilters}
  searchValue={searchValue}
  totalCount={totalCount}
  filteredCount={filteredCount}
/>
```

## 🧭 Navigation Components

### Navigation Configuration

```typescript
import { NAVIGATION_CONFIG } from '@/lib/page-configs';
import { Navbar } from '@/components/navbar/navbar';

// Use predefined navigation configuration
const navigationItems = NAVIGATION_CONFIG.map(item => ({
  ...item,
  active: pathname === item.href,
  onClick: () => router.push(item.href)
}));

// Render navigation
<Navbar items={navigationItems} />
```

### Breadcrumb Navigation

```typescript
import { getPageConfig } from '@/lib/page-configs';

// Get page configuration for breadcrumbs
const pageConfig = getPageConfig('qaReviews');
const breadcrumbs = pageConfig.breadcrumb.map((crumb, index) => ({
  label: crumb,
  href: index === pageConfig.breadcrumb.length - 1 ? undefined : `/${crumb.toLowerCase()}`,
  active: index === pageConfig.breadcrumb.length - 1
}));

<Breadcrumb items={breadcrumbs} />
```

## 🏷️ Status Components

### Status Badge Factory

```typescript
import { createStatusBadgeConfig } from '@/lib/component-library';
import { StatusBadge } from '@/components/ui/status-badge';

// Create status badges dynamically
const statusConfigs = {
  'Not Started': createStatusBadgeConfig('Not Started', 'qaReview'),
  'In Progress': createStatusBadgeConfig('In Progress', 'qaReview'),
  'Completed': createStatusBadgeConfig('Completed', 'qaReview'),
  'Overdue': createStatusBadgeConfig('Overdue', 'qaReview')
};

// Render status badge
<StatusBadge config={statusConfigs[status]} />
```

### Custom Status Rendering

```typescript
import { STATUS_CONFIG } from '@/lib/design-system';

// Get status configuration
const getStatusConfig = (status: string, type: 'qaReview' | 'file' | 'user') => {
  return STATUS_CONFIG[type][status] || { color: 'secondary', icon: 'Info' };
};

// Render with custom styling
const statusConfig = getStatusConfig('Completed', 'qaReview');
const IconComponent = ICON_MAP[statusConfig.icon];

<div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}>
  <IconComponent className="w-3 h-3 mr-1" />
  {status}
</div>
```

## 📐 Layout Components

### Page Layout with Configuration

```typescript
import { getPageConfig } from '@/lib/page-configs';
import { PageHeader } from '@/components/ui/page-header';

// Get page configuration
const pageConfig = getPageConfig('dashboard');

// Render page with configuration
<PageHeader
  title={pageConfig.title}
  description={pageConfig.description}
  icon={pageConfig.icon}
  breadcrumb={pageConfig.breadcrumb}
>
  {/* Page content */}
  {pageConfig.stats && (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {pageConfig.stats.map((stat, index) => (
        <StatCard key={index} config={stat} />
      ))}
    </div>
  )}
  
  {pageConfig.quickActions && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {pageConfig.quickActions.map((action, index) => (
        <QuickActionCard key={index} config={action} />
      ))}
    </div>
  )}
</PageHeader>
```

### Responsive Grid Layout

```typescript
import { createResponsiveClasses } from '@/lib/utils-optimized';

// Create responsive classes
const gridClasses = createResponsiveClasses({
  base: 'grid grid-cols-1 gap-4',
  md: 'grid-cols-2',
  lg: 'grid-cols-3',
  xl: 'grid-cols-4'
});

<div className={gridClasses.base}>
  {/* Grid items */}
</div>
```

## ⚡ Performance Components

### Lazy Loading Components

```typescript
import { createLazyComponent } from '@/lib/performance-optimization';

// Create lazy component with fallback
const LazyAdminPage = createLazyComponent(
  () => import('@/app/admin/page'),
  () => <div className="flex items-center justify-center p-8">Loading admin page...</div>
);

// Use in routing
<Route path="/admin" element={<LazyAdminPage />} />
```

### Memoized Components

```typescript
import { createMemoizedComponent } from '@/lib/performance-optimization';

// Create memoized component
const OptimizedTable = createMemoizedComponent(DataTable, {
  shouldMemoize: true,
  areEqual: (prevProps, nextProps) => 
    prevProps.data.length === nextProps.data.length &&
    prevProps.columns.length === nextProps.columns.length
});

// Use in component
<OptimizedTable data={data} columns={columns} />
```

### Virtual Scrolling

```typescript
import { useVirtualization } from '@/lib/performance-optimization';

// Use virtual scrolling for large lists
const { visibleItems, totalHeight, offsetY } = useVirtualization(largeDataList, {
  itemHeight: 60,
  containerHeight: 400,
  overscan: 5
});

<div className="relative overflow-auto h-96" onScroll={handleScroll}>
  <div style={{ height: totalHeight, position: 'relative' }}>
    <div style={{ transform: `translateY(${offsetY}px)` }}>
      {visibleItems.map((item, index) => (
        <div key={item.id} style={{ height: 60 }}>
          {/* Render item */}
        </div>
      ))}
    </div>
  </div>
</div>
```

## 🔧 Custom Hooks Usage

### Dynamic Filtering

```typescript
import { useDynamicFiltering } from '@/hooks/use-dynamic-filtering';

// Use dynamic filtering hook
const { filteredData, search, filters, handleSearch, handleFilter, handleClearFilters } = useDynamicFiltering({
  data: qaReviews,
  searchFields: ['memberFirm', 'country', 'reviewer'],
  initialFilters: { status: 'In Progress' },
  onDataChange: (data) => {
    console.log(`Filtered ${data.length} items`);
  }
});

// Apply filters
useEffect(() => {
  handleFilter('status', 'Completed');
}, []);

// Clear all filters
const handleReset = () => {
  handleClearFilters();
};
```

### Async Operations

```typescript
import { useAsync } from '@/hooks/use-optimized-hooks';

// Use async hook for data fetching
const { data, loading, error, refetch } = useAsync(
  () => fetchQAReviews(),
  [refreshTrigger]
);

// Handle loading and error states
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} onRetry={refetch} />;
if (!data) return <EmptyState />;

return <DataTable data={data} />;
```

### Local Storage

```typescript
import { useLocalStorage } from '@/hooks/use-optimized-hooks';

// Use local storage hook
const [userPreferences, setUserPreferences] = useLocalStorage('user-preferences', {
  theme: 'light',
  language: 'en',
  notifications: true
});

// Update preferences
const updateTheme = (theme: string) => {
  setUserPreferences(prev => ({ ...prev, theme }));
};
```

## 🎯 Best Practices

### Component Composition

```typescript
// ✅ Good: Compose components using configuration
const PageWithConfig = () => {
  const config = getPageConfig('dashboard');
  
  return (
    <PageLayout config={config}>
      <StatsGrid stats={config.stats} />
      <QuickActions actions={config.quickActions} />
      <DataTable {...config.tableConfig} />
    </PageLayout>
  );
};

// ❌ Bad: Hardcoded components
const PageWithoutConfig = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-4 gap-6">
        {/* Hardcoded stats */}
      </div>
    </div>
  );
};
```

### Error Handling

```typescript
// ✅ Good: Use error handling system
const ComponentWithErrorHandling = () => {
  const { handleError } = useErrorHandler();
  
  const handleAsyncOperation = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      handleError(error, { context: 'async-operation' });
    }
  };
  
  return <button onClick={handleAsyncOperation}>Execute</button>;
};
```

### Performance Optimization

```typescript
// ✅ Good: Use memoization and lazy loading
const OptimizedComponent = memo(({ data }) => {
  const processedData = useMemo(() => 
    data.map(item => processItem(item)), 
    [data]
  );
  
  const handleClick = useCallback((id) => {
    // Handle click
  }, []);
  
  return <DataList data={processedData} onItemClick={handleClick} />;
});
```

This guide provides comprehensive examples of how to use the optimized component library. For more specific use cases, refer to the individual component documentation or the main README file.
