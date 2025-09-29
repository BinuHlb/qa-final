'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar,
  User,
  Building2,
  Mail,
  MapPin,
  Clock,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface FormFieldProps {
  config: FormFieldConfig;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  className?: string;
}

const FieldIcon = ({ type, icon: CustomIcon, className }: { type: string; icon?: React.ComponentType<{ className?: string }>; className?: string }) => {
  const baseClassName = "h-4 w-4 flex-shrink-0";
  
  if (CustomIcon) {
    return <CustomIcon className={`${baseClassName} ${className || ''}`} />;
  }

  const iconMap = {
    text: User,
    email: Mail,
    date: Calendar,
    select: Building2,
    textarea: AlertCircle,
  };

  const Icon = iconMap[type as keyof typeof iconMap] || User;
  return <Icon className={`${baseClassName} ${className || ''}`} />;
};

export function FormField({ config, value, onChange, error, className }: FormFieldProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleChange = (newValue: any) => {
    onChange(newValue);
  };

  const renderInput = () => {
    const baseInputProps = {
      id: config.name,
      value: value || '',
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      className: cn(
        "transition-all duration-200",
        isFocused && "ring-2 ring-primary/20 border-primary/50",
        isHovered && "border-primary/30",
        error && "border-destructive focus:ring-destructive/20"
      )
    };

    switch (config.type) {
      case 'select':
        return (
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger 
              {...baseInputProps}
              className={cn(
                "bg-white dark:bg-gray-800 border-2 border-primary/20 dark:border-primary/30",
                "hover:bg-white dark:hover:bg-gray-800 hover:border-primary/40 transition-all duration-200",
                isFocused && "ring-2 ring-primary/30 border-primary/60",
                isHovered && "border-primary/40",
                error && "border-destructive focus:ring-destructive/30",
                baseInputProps.className
              )}
            >
              <div className="flex items-center gap-2 min-h-[20px]">
                <FieldIcon 
                  type={config.type} 
                  icon={config.icon}
                  className={cn(
                    "text-muted-foreground transition-colors duration-200",
                    isFocused && "text-primary",
                    isHovered && "text-primary/70"
                  )}
                />
                <SelectValue placeholder={config.placeholder} />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-2 border-primary/20 dark:border-primary/30">
              {config.options?.map((option) => (
                <SelectItem key={option} value={option} className="hover:bg-primary/10">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'textarea':
        return (
          <Textarea
            {...baseInputProps}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={config.placeholder}
            rows={3}
            className={cn(
              "bg-white dark:bg-gray-800 border-2 border-primary/20 dark:border-primary/30",
              "hover:bg-white dark:hover:bg-gray-800 hover:border-primary/40 transition-all duration-200",
              "resize-none",
              baseInputProps.className
            )}
          />
        );

      default:
        return (
          <div className="relative">
            <FieldIcon 
              type={config.type} 
              icon={config.icon} 
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors duration-200 z-10",
                isFocused && "text-primary",
                isHovered && "text-primary/70"
              )}
            />
            <Input
              {...baseInputProps}
              type={config.type}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={config.placeholder}
              className={cn(
                "bg-white dark:bg-gray-800 border-2 border-primary/20 dark:border-primary/30",
                "hover:bg-white dark:hover:bg-gray-800 hover:border-primary/40 transition-all duration-200",
                "pl-10 pr-4",
                baseInputProps.className
              )}
            />
          </div>
        );
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Label 
          htmlFor={config.name}
          className={cn(
            "text-sm font-semibold transition-colors duration-200",
            isFocused && "text-primary",
            error && "text-destructive"
          )}
        >
          {config.label}
          {config.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {error && (
          <div className="flex items-center gap-1 text-destructive">
            <AlertCircle className="h-3 w-3" />
            <span className="text-xs">{error}</span>
          </div>
        )}
      </div>
      
      {config.description && (
        <p className="text-xs text-muted-foreground">{config.description}</p>
      )}
      
      {renderInput()}
    </div>
  );
}

// Form field configurations
export const QA_REVIEW_FORM_CONFIG: FormFieldConfig[] = [
  {
    name: 'memberFirmIntranetName',
    label: 'Member Firm Name',
    type: 'text',
    placeholder: 'Enter firm name',
    required: true,
    icon: Building2,
    description: 'The official name of the member firm'
  },
  {
    name: 'type',
    label: 'Firm Type',
    type: 'select',
    placeholder: 'Select firm type',
    required: true,
    options: ['Current Members', 'Prospect'],
    icon: Building2,
    description: 'Type of firm relationship'
  },
  {
    name: 'memberContact',
    label: 'Member Contact',
    type: 'email',
    placeholder: 'contact@firm.com',
    required: true,
    icon: Mail,
    description: 'Primary contact email address'
  },
  {
    name: 'reviewerName',
    label: 'Reviewer Name',
    type: 'text',
    placeholder: 'Enter reviewer name',
    required: true,
    icon: User,
    description: 'Assigned reviewer for this QA review'
  },
  {
    name: 'country',
    label: 'Country',
    type: 'select',
    placeholder: 'Select country',
    required: true,
    options: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'China', 'India', 'Brazil'],
    icon: MapPin,
    description: 'Country where the firm is located'
  },
  {
    name: 'reviewPlanned',
    label: 'Review Start Date',
    type: 'date',
    placeholder: 'Select start date',
    required: true,
    icon: Calendar,
    description: 'Planned start date for the review'
  },
  {
    name: 'reviewEndDate',
    label: 'Review End Date',
    type: 'date',
    placeholder: 'Select end date',
    required: true,
    icon: Calendar,
    description: 'Expected completion date'
  },
  {
    name: 'currentGrading',
    label: 'Current Grade',
    type: 'select',
    placeholder: 'Select current grade',
    options: ['1', '2', '3', '4', '5'],
    icon: Star,
    description: 'Current quality grade (1=Best, 5=Poor)'
  },
  {
    name: 'previousGrading',
    label: 'Previous Grade',
    type: 'select',
    placeholder: 'Select previous grade',
    options: ['1', '2', '3', '4', '5'],
    icon: Star,
    description: 'Previous quality grade'
  },
  {
    name: 'reviewerStatus',
    label: 'Reviewer Status',
    type: 'select',
    placeholder: 'Select status',
    options: ['Active', '⛔'],
    icon: CheckCircle,
    description: 'Current status of the reviewer'
  },
  {
    name: 'partnerStatus',
    label: 'Partner Status',
    type: 'select',
    placeholder: 'Select status',
    options: ['Approved', '⛔'],
    icon: CheckCircle,
    description: 'Partner approval status'
  },
  {
    name: 'qaReviewStatus',
    label: 'QA Review Status',
    type: 'select',
    placeholder: 'Select status',
    options: ['Not Started', 'In Progress', 'Completed'],
    icon: Clock,
    description: 'Current status of the QA review'
  }
];
