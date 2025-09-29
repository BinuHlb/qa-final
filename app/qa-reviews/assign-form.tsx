'use client';

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QAReview } from "@/types/qaReview";

interface AssignReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: QAReview;
  onSubmit: (data: { assignedTo: string; notes: string; dueDate: string; priority: string }) => void;
}

export function AssignReviewDialog({ open, onOpenChange, review, onSubmit }: AssignReviewDialogProps) {
  const [assignedTo, setAssignedTo] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [priority, setPriority] = React.useState("medium");

  React.useEffect(() => {
    if (review) {
      setAssignedTo("");
      setNotes("");
      setDueDate("");
      setPriority("medium");
    }
  }, [review]);

  const handleSubmit = () => {
    if (!assignedTo || !dueDate) return;
    
    onSubmit({
      assignedTo,
      notes,
      dueDate,
      priority
    });
    
    // Reset form
    setAssignedTo("");
    setNotes("");
    setDueDate("");
    setPriority("medium");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign QA Review</DialogTitle>
        </DialogHeader>

        {review ? (
          <div className="space-y-6">
            {/* Review Information */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Review Information</h4>
              <div className="grid gap-2 text-sm">
                <div><span className="font-medium">Firm:</span> {review.memberFirmIntranetName}</div>
                <div><span className="font-medium">Country:</span> {review.country}</div>
                <div><span className="font-medium">Current Reviewer:</span> {review.reviewerName}</div>
                <div><span className="font-medium">Status:</span> {review.qaReviewStatus}</div>
              </div>
            </div>

            {/* Assignment Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                    <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any additional notes or requirements..."
                  rows={4}
                />
              </div>
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
            onClick={handleSubmit}
            disabled={!assignedTo || !dueDate}
          >
            Assign Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}