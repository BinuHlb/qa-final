'use client';

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QAReview } from "@/types/qaReview";
import { Calendar, User, Building, FileText } from "lucide-react";

interface QAReviewDetailDialogProps {
  open: boolean;
  onClose: () => void;
  review: QAReview | null;
}

export function QAReviewDetailDialog({ open, onClose, review }: QAReviewDetailDialogProps) {
  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            QA Review Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Firm</label>
                <p className="text-lg font-semibold">{review.memberFirmIntranetName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Country</label>
                <p className="text-lg font-semibold">{review.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reviewer</label>
                <p className="text-lg font-semibold">{review.reviewerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Review Type</label>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {review.type}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Review Status</label>
                <Badge 
                  variant="secondary" 
                  className={`${
                    review.qaReviewStatus === 'In Progress' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : review.qaReviewStatus === 'Completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {review.qaReviewStatus}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Grading</label>
                <p className="text-lg font-semibold">{review.currentGrading}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Previous Grading</label>
                <p className="text-lg font-semibold">{review.previousGrading}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Contact</label>
                <p className="text-lg font-semibold">{review.memberContact}</p>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Review Planned</label>
              <p className="text-lg font-semibold">{review.reviewPlanned}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Review End Date</label>
              <p className="text-lg font-semibold">{review.reviewEndDate}</p>
            </div>
          </div>

          {/* Status Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Reviewer Status</label>
              <Badge 
                variant="secondary" 
                className={`${
                  review.reviewerStatus === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : review.reviewerStatus === 'Approved'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {review.reviewerStatus}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Partner Status</label>
              <Badge 
                variant="secondary" 
                className={`${
                  review.partnerStatus === 'Approved' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {review.partnerStatus}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}