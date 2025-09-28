'use client';

import { Card, CardContent } from '@/components/ui/card';
import { STATUS_FILTERS, GRADE_COLORS, getLabelColorClass, FilterConfig, GradeColorConfig } from './filter-layouts';

interface FilterComponentProps {
  data: any[];
  statusFilter: 'all' | 'Not Started' | 'In Progress' | 'Completed';
  onStatusFilterChange: (filter: 'all' | 'Not Started' | 'In Progress' | 'Completed') => void;
}

export function FilterComponent({ data, statusFilter, onStatusFilterChange }: FilterComponentProps) {
  const getFilterCount = (filterValue: string) => {
    if (filterValue === 'all') return data.length;
    return data.filter(item => item.qaReviewStatus === filterValue).length;
  };

  return (
    <Card className="border border-white/20 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Grade Color Legend */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <div className="w-full flex items-center">
              <span className="text-xs font-semibold text-foreground/90 mr-4 whitespace-nowrap">
                Grade Colors:
              </span>
              <div className="grid grid-cols-5 gap-1 flex-1">
                {GRADE_COLORS.map(({ label, bgColor }: GradeColorConfig) => (
                  <div key={label} className="flex flex-col items-center justify-center">
                    <div className={`w-4 h-4 rounded-full ${bgColor} mb-1`} />
                    <span className="text-xs text-foreground/80 text-center leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Status Filter Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {STATUS_FILTERS.map((filter: FilterConfig) => {
                const count = getFilterCount(filter.value);
                const isActive = statusFilter === filter.value;
                const ring = isActive ? 'ring-2 ring-offset-1 ring-yellow-500' : '';
                
                return (
                  <div
                    key={filter.value}
                    className={`cursor-pointer rounded-lg bg-gradient-to-br ${filter.bg} backdrop-blur-sm border border-white/20 p-2 flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group select-none ${ring}`}
                    onClick={() => onStatusFilterChange(filter.value as 'all' | 'Not Started' | 'In Progress' | 'Completed')}
                  >
                    <span className={`text-xl font-bold ${filter.text}`}>
                      {count}
                    </span>
                    <span className={`${getLabelColorClass(filter.color)} text-xs mt-0.5 font-semibold text-center leading-tight`}>
                      {filter.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
