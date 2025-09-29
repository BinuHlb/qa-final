'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Clock,
  User,
  Calendar,
  Star,
  AlertTriangle,
  Info,
  FileCheck,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { ExcelFile, FileReviewHistory, ReviewStage, WorkflowStatus } from '@/types/user';
import { ExcelValidationResult } from '@/types/fileManagement';

interface FileReviewInterfaceProps {
  file: ExcelFile;
  reviewerId: string;
  reviewerName: string;
  onReviewSubmit: (review: FileReviewSubmission) => void;
  onDownloadFile: (fileId: string) => void;
  onUploadRevision: (fileId: string, file: File) => void;
}

interface FileReviewSubmission {
  fileId: string;
  stage: ReviewStage;
  status: WorkflowStatus;
  score: number;
  comments: string;
  recommendations: string[];
  attachments: File[];
  isApproved: boolean;
}

export function FileReviewInterface({ 
  file, 
  reviewerId, 
  reviewerName,
  onReviewSubmit,
  onDownloadFile,
  onUploadRevision 
}: FileReviewInterfaceProps) {
  const [reviewData, setReviewData] = useState<Partial<FileReviewSubmission>>({
    fileId: file.id,
    stage: 'technical_review',
    status: 'pending',
    score: 0,
    comments: '',
    recommendations: [],
    attachments: [],
    isApproved: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResults, setValidationResults] = useState<ExcelValidationResult[]>([]);

  useEffect(() => {
    // Load validation results from file metadata
    if (file.metadata?.extractedData?.validationResults) {
      setValidationResults(file.metadata.extractedData.validationResults);
    }
  }, [file]);

  const handleScoreChange = (score: number) => {
    setReviewData(prev => ({ ...prev, score }));
  };

  const handleRecommendationToggle = (recommendation: string, checked: boolean) => {
    setReviewData(prev => ({
      ...prev,
      recommendations: checked 
        ? [...(prev.recommendations || []), recommendation]
        : (prev.recommendations || []).filter(r => r !== recommendation)
    }));
  };

  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setReviewData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...files]
    }));
  };

  const handleSubmitReview = async () => {
    if (!reviewData.comments?.trim()) {
      alert('Please provide review comments');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const submission: FileReviewSubmission = {
        fileId: file.id,
        stage: reviewData.stage || 'technical_review',
        status: reviewData.isApproved ? 'completed' : 'rejected',
        score: reviewData.score || 0,
        comments: reviewData.comments || '',
        recommendations: reviewData.recommendations || [],
        attachments: reviewData.attachments || [],
        isApproved: reviewData.isApproved || false
      };

      onReviewSubmit(submission);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const commonRecommendations = [
    'Improve data accuracy and completeness',
    'Add more detailed analysis and insights',
    'Include executive summary section',
    'Enhance data visualization with charts',
    'Add supporting documentation',
    'Improve formatting and presentation',
    'Include risk assessment details',
    'Add compliance verification checklist'
  ];

  return (
    <div className="space-y-6">
      {/* File Information */}
      <Card className="border border-white/30 bg-gradient-to-br from-blue-50 via-sky-100 to-cyan-100 backdrop-blur-md dark:from-blue-950/20 dark:via-sky-900/20 dark:to-cyan-900/20 dark:border-white/20">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            File Review: {file.originalName}
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Review and evaluate the submitted Excel file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-blue-800 dark:text-blue-200">File Size</Label>
              <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                {(file.fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-blue-800 dark:text-blue-200">Uploaded</Label>
              <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                {file.uploadedAt.toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-blue-800 dark:text-blue-200">Version</Label>
              <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                v{file.version}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-blue-800 dark:text-blue-200">Status</Label>
              <Badge variant="outline" className="border-blue-500 text-blue-700">
                {file.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={() => onDownloadFile(file.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download File
            </Button>
            <Button variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-50">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Analysis */}
      {file.metadata?.extractedData && (
        <Card className="border border-white/30 bg-gradient-to-br from-green-50 via-emerald-100 to-teal-100 backdrop-blur-md dark:from-green-950/20 dark:via-emerald-900/20 dark:to-teal-900/20 dark:border-white/20">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              File Analysis
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Automated analysis of the Excel file structure and content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 dark:bg-white/20 dark:border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <Label className="text-sm font-medium text-green-800 dark:text-green-200">Data Quality</Label>
                </div>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {file.metadata.extractedData.summary.dataQualityScore}%
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 dark:bg-white/20 dark:border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <Label className="text-sm font-medium text-green-800 dark:text-green-200">Completeness</Label>
                </div>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {file.metadata.extractedData.summary.completenessScore}%
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 dark:bg-white/20 dark:border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <Label className="text-sm font-medium text-green-800 dark:text-green-200">Issues Found</Label>
                </div>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {file.metadata.extractedData.summary.issuesFound}
                </p>
              </div>
            </div>

            {/* Validation Results */}
            {validationResults.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium text-green-800 dark:text-green-200 mb-2 block">
                  Validation Results
                </Label>
                <div className="space-y-2">
                  {validationResults.map((result, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      result.type === 'error' ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800' :
                      result.type === 'warning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800' :
                      'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                    }`}>
                      <div className="flex items-start gap-2">
                        {result.type === 'error' ? (
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                        ) : result.type === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                        ) : (
                          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {result.message}
                          </p>
                          {result.sheet && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Sheet: {result.sheet}
                              {result.row && `, Row: ${result.row}`}
                              {result.column && `, Column: ${result.column}`}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {result.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      <Card className="border border-white/30 bg-gradient-to-br from-purple-50 via-pink-100 to-rose-100 backdrop-blur-md dark:from-purple-950/20 dark:via-pink-900/20 dark:to-rose-900/20 dark:border-white/20">
        <CardHeader>
          <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Review Assessment
          </CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-300">
            Provide your evaluation and feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Overall Score (0-100)
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {[20, 40, 60, 80, 100].map((score) => (
                <Button
                  key={score}
                  variant={reviewData.score === score ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleScoreChange(score)}
                  className={reviewData.score === score ? "bg-purple-600 hover:bg-purple-700" : "border-purple-500 text-purple-700 hover:bg-purple-50"}
                >
                  {score}
                </Button>
              ))}
            </div>
            {reviewData.score && reviewData.score > 0 && (
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getScoreColor(reviewData.score)}`}>
                  {reviewData.score}/100
                </span>
                <Badge variant="outline" className={getScoreColor(reviewData.score)}>
                  {getScoreLabel(reviewData.score)}
                </Badge>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Review Comments *
            </Label>
            <Textarea
              placeholder="Provide detailed feedback about the file quality, accuracy, completeness, and any areas for improvement..."
              value={reviewData.comments || ''}
              onChange={(e) => setReviewData(prev => ({ ...prev, comments: e.target.value }))}
              rows={6}
              className="border-purple-200 focus:border-purple-400 dark:border-purple-800 dark:focus:border-purple-600"
            />
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Recommendations
            </Label>
            <div className="grid gap-2">
              {commonRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`recommendation-${index}`}
                    checked={(reviewData.recommendations || []).includes(recommendation)}
                    onCheckedChange={(checked) => handleRecommendationToggle(recommendation, !!checked)}
                  />
                  <Label 
                    htmlFor={`recommendation-${index}`}
                    className="text-sm text-purple-700 dark:text-purple-300 cursor-pointer"
                  >
                    {recommendation}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Attach Supporting Files (Optional)
            </Label>
            <input
              type="file"
              multiple
              onChange={handleFileAttachment}
              className="block w-full text-sm text-purple-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-900/20 dark:file:text-purple-300"
            />
            {reviewData.attachments && reviewData.attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Attached Files:</p>
                {reviewData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-purple-700 dark:text-purple-300">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Final Decision */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Final Decision
            </Label>
            <RadioGroup
              value={reviewData.isApproved ? 'approve' : 'reject'}
              onValueChange={(value) => setReviewData(prev => ({ ...prev, isApproved: value === 'approve' }))}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approve" id="approve" />
                <Label htmlFor="approve" className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <ThumbsUp className="h-4 w-4" />
                  Approve
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reject" id="reject" />
                <Label htmlFor="reject" className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <ThumbsDown className="h-4 w-4" />
                  Reject
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4 border-t border-purple-200 dark:border-purple-800">
            <Button 
              variant="outline" 
              className="border-purple-500 text-purple-700 hover:bg-purple-50"
              disabled={isSubmitting}
            >
              Save Draft
            </Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={isSubmitting || !reviewData.comments?.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
