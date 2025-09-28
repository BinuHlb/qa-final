'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">
              {editingReview ? 'Edit QA Review' : 'Add New QA Review'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="memberFirmIntranetName">Member Firm Name</Label>
                <Input
                  id="memberFirmIntranetName"
                  {...form.register('memberFirmIntranetName')}
                />
                {form.formState.errors.memberFirmIntranetName && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.memberFirmIntranetName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={form.watch('type')}
                  onValueChange={(value) => form.setValue('type', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIRM_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="memberContact">Member Contact</Label>
                <Input
                  id="memberContact"
                  type="email"
                  {...form.register('memberContact')}
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
                  <SelectTrigger>
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
                />
              </div>

              <div>
                <Label htmlFor="reviewEndDate">Review End Date</Label>
                <Input
                  id="reviewEndDate"
                  type="date"
                  {...form.register('reviewEndDate')}
                />
              </div>

              <div>
                <Label htmlFor="currentGrading">Current Grading</Label>
                <Select
                  value={form.watch('currentGrading')}
                  onValueChange={(value) => form.setValue('currentGrading', value)}
                >
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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