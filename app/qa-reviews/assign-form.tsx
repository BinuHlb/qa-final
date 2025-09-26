'use client';

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QAReview } from "@/lib/mockData";

interface AssignReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: QAReview;  // Row data
  onSubmit: (data: { assignedTo: string; notes: string }) => void;
}

export function AssignReviewDialog({ open, onOpenChange, review, onSubmit }: AssignReviewDialogProps) {
  const [assignedTo, setAssignedTo] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (review) {
      setAssignedTo("");
      setNotes("");
    }
  }, [review]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign QA Review</DialogTitle>
        </DialogHeader>

        {review ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Firm</p>
              <p className="font-medium">{review.memberFirmIntranetName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Reviewer</p>
              <p className="font-medium">{review.reviewerName}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assign To</label>
              <Input
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Enter user name or email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes..."
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No review selected</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSubmit({ assignedTo, notes });
              onOpenChange(false);
            }}
            disabled={!assignedTo}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
