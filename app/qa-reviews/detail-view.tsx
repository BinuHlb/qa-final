'use client';

import { QAReview } from '@/types/qaReview';
import { StatusBadge } from '@/components/ui/status-badge';

interface QAReviewDetailDialogProps {
  open: boolean;
  onClose: () => void;
  review: QAReview | null;
}

export function QAReviewDetailDialog({ open, onClose, review }: QAReviewDetailDialogProps) {
  if (!open || !review) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <span className="mr-3">{review.memberFirmIntranetName}</span>
          <StatusBadge status={review.type} />
        </h3>

        {/* Reviewer + Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Reviewer</p>
            <p className="font-semibold text-gray-900 dark:text-white">{review.reviewerName}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Country</p>
            <p className="font-semibold text-gray-900 dark:text-white">{review.country}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Planned Start</p>
            <p className="font-mono text-gray-900 dark:text-white">{review.reviewPlanned}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">End Date</p>
            <p className="font-mono text-gray-900 dark:text-white">{review.reviewEndDate}</p>
          </div>
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        {/* Grading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Previous Grading</p>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">
              {review.previousGrading}
            </span>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Current Grading</p>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-semibold">
              {review.currentGrading}
            </span>
          </div>
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        {/* Statuses */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Reviewer Status</p>
            <StatusBadge status={review.reviewerStatus} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Partner Status</p>
            <StatusBadge status={review.partnerStatus} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">QA Review Status</p>
            <StatusBadge status={review.qaReviewStatus} />
          </div>
        </div>
      </div>
    </div>
  );
}
