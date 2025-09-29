'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, FileCheck, Save, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { QAReview } from '@/types/qaReview';
import { FormField, QA_REVIEW_FORM_CONFIG } from '@/components/ui/form-field';
import { toast } from 'sonner';

const qaReviewSchema = z.object({
  memberFirmIntranetName: z.string().min(1, 'Firm name is required'),
  type: z.enum(['Current Members', 'Prospect']),
  memberContact: z.string().email('Valid email is required'),
  reviewerName: z.string().min(1, 'Reviewer name is required'),
  country: z.string().min(1, 'Country is required'),
  reviewPlanned: z.string().min(1, 'Review start date is required'),
  reviewEndDate: z.string().min(1, 'Review end date is required'),
  currentGrading: z.string().optional(),
  previousGrading: z.string().optional(),
  reviewerStatus: z.enum(['Active', '⛔']).optional(),
  partnerStatus: z.enum(['Approved', '⛔']).optional(),
  qaReviewStatus: z.enum(['Not Started', 'In Progress', 'Completed']).optional(),
  forceSubmit: z.boolean().optional(),
});

type QAReviewFormData = z.infer<typeof qaReviewSchema>;

interface QAReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<QAReview, 'id'>) => void;
  editingReview?: QAReview | null;
}

export function QAReviewDrawer({
  isOpen,
  onClose,
  onSave,
  editingReview,
}: QAReviewDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getSafeDefaultValues = (): Partial<QAReviewFormData> => {
    if (editingReview) {
      return {
        memberFirmIntranetName: editingReview.memberFirmIntranetName || '',
        type: editingReview.type as 'Current Members' | 'Prospect',
        memberContact: editingReview.memberContact || '',
        reviewerName: editingReview.reviewerName || '',
        country: editingReview.country || '',
        reviewPlanned: editingReview.reviewPlanned || '',
        reviewEndDate: editingReview.reviewEndDate || '',
        currentGrading: editingReview.currentGrading?.toString() || '',
        previousGrading: editingReview.previousGrading?.toString() || '',
        reviewerStatus: editingReview.reviewerStatus as 'Active' | '⛔' || 'Active',
        partnerStatus: editingReview.partnerStatus as 'Approved' | '⛔' || 'Approved',
        qaReviewStatus: editingReview.qaReviewStatus as 'Not Started' | 'In Progress' | 'Completed' || 'Not Started',
        forceSubmit: false,
      };
    }
    return {
          memberFirmIntranetName: '',
      type: 'Current Members' as const,
          memberContact: '',
          reviewerName: '',
          country: '',
          reviewPlanned: '',
          reviewEndDate: '',
          currentGrading: '',
          previousGrading: '',
      reviewerStatus: 'Active' as const,
      partnerStatus: 'Approved' as const,
      qaReviewStatus: 'Not Started' as const,
      forceSubmit: false,
        };
  };

  const form = useForm<QAReviewFormData>({
    resolver: zodResolver(qaReviewSchema),
    defaultValues: getSafeDefaultValues(),
  });

  const onSubmit = async (data: QAReviewFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      
      const reviewData = {
        ...data,
        currentGrading: data.currentGrading || '',
        previousGrading: data.previousGrading || '',
        reviewerStatus: data.reviewerStatus || 'Active',
        partnerStatus: data.partnerStatus || 'Approved',
        qaReviewStatus: data.qaReviewStatus || 'Not Started',
        id: editingReview?.id || Math.random().toString(),
      };
      
      onSave(reviewData);
      form.reset();
      onClose();
      toast.success(editingReview ? 'Review updated successfully!' : 'Review created successfully!');
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Failed to save review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 h-screen w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl border-l-2 border-primary/30 dark:border-primary/50"
      >
        <div className="flex h-screen flex-col">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between border-b-2 border-primary/20 dark:border-primary/30 px-6 py-5 bg-primary/10 dark:bg-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                <FileCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
              {editingReview ? 'Edit QA Review' : 'Add New QA Review'}
            </h2>
                <p className="text-xs text-muted-foreground">
                  {editingReview ? 'Update review details' : 'Create a new quality review'}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Enhanced Form Container */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Dynamic Form Fields */}
                <div className="grid gap-6">
                  {QA_REVIEW_FORM_CONFIG.map((fieldConfig) => {
                    const fieldValue = form.watch(fieldConfig.name as any);
                    const fieldError = form.formState.errors[fieldConfig.name as keyof typeof form.formState.errors]?.message;
                    
                    return (
                      <FormField
                        key={fieldConfig.name}
                        config={fieldConfig}
                        value={fieldValue}
                        onChange={(value) => form.setValue(fieldConfig.name as any, value)}
                        error={fieldError as string}
                      />
                    );
                  })}
              </div>

                {/* Force Submit Checkbox */}
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-primary/10 dark:bg-primary/20 border-2 border-primary/30 dark:border-primary/40">
                  <Checkbox
                    id="forceSubmit"
                    checked={form.watch('forceSubmit')}
                    onCheckedChange={(checked) => form.setValue('forceSubmit', !!checked)}
                    className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex-1">
                    <Label htmlFor="forceSubmit" className="text-sm font-semibold text-foreground cursor-pointer">
                      Force submit
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Bypass validation checks (use with caution)
                    </p>
              </div>
              </div>
            </form>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="border-t-2 border-primary/20 dark:border-primary/30 px-6 py-5 bg-primary/10 dark:bg-primary/20">
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 min-w-[100px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Review
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
