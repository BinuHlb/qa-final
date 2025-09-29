'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, FileCheck, Save, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QAReview } from '@/types/qaReview';
import {
  QA_REVIEW_STATUS_OPTIONS,
  REVIEWER_STATUS_OPTIONS,
  PARTNER_STATUS_OPTIONS,
  FIRM_TYPE_OPTIONS,
  COUNTRIES,
  GRADINGS,
} from '@/lib/constants';
import { FormField, QA_REVIEW_FORM_CONFIG } from '@/components/ui/form-field';

const qaReviewSchema = z.object({
  memberFirmIntranetName: z.string().min(1, 'Firm name is required'),
  type: z.enum(['Prospect', 'Current Members']),
  memberContact: z.string().email('Valid email is required'),
  reviewerName: z.string().min(1, 'Reviewer name is required'),
  country: z.string().min(1, 'Country is required'),
  reviewerStatus: z.enum(['⛔', 'Active']),
  partnerStatus: z.enum(['⛔', 'Approved']),
  reviewPlanned: z.string().min(1, 'Review planned date is required'),
  reviewEndDate: z.string().min(1, 'Review end date is required'),
  currentGrading: z.string().min(1, 'Current grading is required'),
  previousGrading: z.string().min(1, 'Previous grading is required'),
  qaReviewStatus: z.enum(['Not Started', 'In Progress', 'Completed']),
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

  // Fix: Only allow reviewerStatus and partnerStatus values that match the schema
  const getSafeDefaultValues = (): QAReviewFormData => {
    return editingReview
      ? {
          memberFirmIntranetName: editingReview.memberFirmIntranetName,
          type: editingReview.type,
          memberContact: editingReview.memberContact,
          reviewerName: editingReview.reviewerName,
          country: editingReview.country,
          reviewerStatus:
            editingReview.reviewerStatus === 'Active' || editingReview.reviewerStatus === '⛔'
              ? editingReview.reviewerStatus
              : 'Active',
          partnerStatus:
            editingReview.partnerStatus === 'Approved' || editingReview.partnerStatus === '⛔'
              ? editingReview.partnerStatus
              : 'Approved',
          reviewPlanned: editingReview.reviewPlanned,
          reviewEndDate: editingReview.reviewEndDate,
          currentGrading: editingReview.currentGrading,
          previousGrading: editingReview.previousGrading,
          qaReviewStatus: editingReview.qaReviewStatus,
        }
      : {
          memberFirmIntranetName: '',
          type: 'Current Members',
          memberContact: '',
          reviewerName: '',
          country: '',
          reviewerStatus: 'Active',
          partnerStatus: 'Approved',
          reviewPlanned: '',
          reviewEndDate: '',
          currentGrading: '',
          previousGrading: '',
          qaReviewStatus: 'Not Started',
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
      onSave(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error saving review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-16 h-[calc(100vh-4rem)] w-full max-w-lg bg-gradient-to-br from-white/98 to-white/95 dark:from-gray-900/98 dark:to-gray-900/95 backdrop-blur-xl shadow-2xl border-l border-white/20 dark:border-white/10"
      >
        <div className="flex h-full flex-col">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between border-b border-white/20 dark:border-white/10 px-6 py-5 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
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

              <div>
                <Label htmlFor="memberContact">Member Contact</Label>
                <Input
                  id="memberContact"
                  type="email"
                  {...form.register('memberContact')}
                  className="bg-white/95 dark:bg-gray-800/95 border-primary-200/50 dark:border-primary-800/50"
                />
                {form.formState.errors.memberContact && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.memberContact.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="reviewerName">Reviewer Name</Label>
                <Input
                  id="reviewerName"
                  {...form.register('reviewerName')}
                  className="bg-white/95 dark:bg-gray-800/95 border-primary-200/50 dark:border-primary-800/50"
                />
                {form.formState.errors.reviewerName && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.reviewerName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={form.watch('country')}
                  onValueChange={(value) => form.setValue('country', value)}
                >
                  <SelectTrigger className="bg-white/95 dark:bg-gray-800/95 border-primary-200/50 dark:border-primary-800/50">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reviewPlanned">Review Planned Date</Label>
                <Input
                  id="reviewPlanned"
                  type="date"
                  {...form.register('reviewPlanned')}
                  className="bg-white/95 dark:bg-gray-800/95 border-primary-200/50 dark:border-primary-800/50"
                />
              </div>

              <div>
                <Label htmlFor="reviewEndDate">Review End Date</Label>
                <Input
                  id="reviewEndDate"
                  type="date"
                  {...form.register('reviewEndDate')}
                  className="bg-white/95 dark:bg-gray-800/95 border-primary-200/50 dark:border-primary-800/50"
                />
              </div>

              <div>
                <Label htmlFor="currentGrading">Current Grading</Label>
                <Select
                  value={form.watch('currentGrading')}
                  onValueChange={(value) => form.setValue('currentGrading', value)}
                >
                  <SelectTrigger className="bg-white/95 dark:bg-gray-800/95 border-primary-200/50 dark:border-primary-800/50">
                    <SelectValue placeholder="Select grading" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADINGS.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="previousGrading">Previous Grading</Label>
                <Select
                  value={form.watch('previousGrading')}
                  onValueChange={(value) => form.setValue('previousGrading', value)}
                >
                  <SelectTrigger className="bg-white/95 dark:bg-gray-800/95 border-primary-200/50 dark:border-primary-800/50">
                    <SelectValue placeholder="Select grading" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADINGS.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reviewerStatus">Reviewer Status</Label>
                <Select
                  value={form.watch('reviewerStatus')}
                  onValueChange={(value) => form.setValue('reviewerStatus', value as any)}
                >
                  <SelectTrigger className="bg-white/95 dark:bg-gray-800/95 border-primary-200/50 dark:border-primary-800/50">
                    <SelectValue placeholder="Select reviewer status" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVIEWER_STATUS_OPTIONS.filter(
                      (status) => status === 'Active' || status === '⛔'
                    ).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="partnerStatus">Partner Status</Label>
                <Select
                  value={form.watch('partnerStatus')}
                  onValueChange={(value) => form.setValue('partnerStatus', value as any)}
                >
                  <SelectTrigger className="bg-white/95 dark:bg-gray-800/95 border-primary-200/50 dark:border-primary-800/50">
                    <SelectValue placeholder="Select partner status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTNER_STATUS_OPTIONS.filter(
                      (status) => status === 'Approved' || status === '⛔'
                    ).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="qaReviewStatus">QA Review Status</Label>
                <Select
                  value={form.watch('qaReviewStatus')}
                  onValueChange={(value) => form.setValue('qaReviewStatus', value as any)}
                >
                  <SelectTrigger className="bg-white/95 dark:bg-gray-800/95 border-primary-200/50 dark:border-primary-800/50">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {QA_REVIEW_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>

          <div className="border-t px-6 py-4">
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}