'use client';

import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Eye,
  FileX
} from 'lucide-react';
import { EXCEL_FILE_TYPES, MAX_FILE_SIZE, MAX_FILES_PER_UPLOAD } from '@/types/fileManagement';
import { ExcelFile, FileStatus } from '@/types/user';

interface FileUploadComponentProps {
  onFilesUploaded: (files: ExcelFile[]) => void;
  memberFirmId: string;
  maxFiles?: number;
  disabled?: boolean;
}

interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
  uploadedFile?: ExcelFile;
}

export function FileUploadComponent({ 
  onFilesUploaded, 
  memberFirmId, 
  maxFiles = MAX_FILES_PER_UPLOAD,
  disabled = false 
}: FileUploadComponentProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (disabled || files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => 
      EXCEL_FILE_TYPES.includes(file.type as any)
    );
    
    const invalidFiles = files.filter(file => 
      !EXCEL_FILE_TYPES.includes(file.type as any)
    );

    if (invalidFiles.length > 0) {
      alert(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}. Only Excel files (.xlsx, .xls) are allowed.`);
    }

    if (validFiles.length === 0) return;

    // Check file limit
    if (uploadedFiles.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Process valid files
    const newUploadedFiles: UploadedFile[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      status: 'uploading' as const,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
    setIsUploading(true);

    // Simulate file upload process
    for (const uploadedFile of newUploadedFiles) {
      await simulateFileUpload(uploadedFile);
    }

    setIsUploading(false);
    
    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [uploadedFiles.length, maxFiles, disabled, memberFirmId]);

  const simulateFileUpload = async (uploadedFile: UploadedFile) => {
    const totalSteps = 100;
    const stepDuration = 50; // milliseconds

    for (let progress = 0; progress <= totalSteps; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      
      setUploadedFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, progress }
          : f
      ));
    }

    // Simulate successful upload
    const excelFile: ExcelFile = {
      id: `file-${Date.now()}`,
      fileName: `${Date.now()}-${uploadedFile.file.name}`,
      originalName: uploadedFile.file.name,
      fileSize: uploadedFile.file.size,
      fileType: uploadedFile.file.type as any,
      uploadedBy: 'current-user-id', // This should come from auth context
      uploadedAt: new Date(),
      status: 'uploaded' as FileStatus,
      memberFirmId,
      version: 1,
      downloadUrl: `/api/files/download/${Date.now()}`,
      metadata: {
        sheetCount: Math.floor(Math.random() * 5) + 1,
        rowCount: Math.floor(Math.random() * 1000) + 100,
        columnCount: Math.floor(Math.random() * 20) + 5,
        lastModified: new Date(),
        fileHash: `hash-${Date.now()}`,
        processingStatus: 'completed',
        extractedData: {
          sheets: [],
          summary: {
            totalRows: Math.floor(Math.random() * 1000) + 100,
            totalColumns: Math.floor(Math.random() * 20) + 5,
            dataQualityScore: Math.floor(Math.random() * 30) + 70,
            completenessScore: Math.floor(Math.random() * 25) + 75,
            issuesFound: Math.floor(Math.random() * 10)
          },
          validationResults: []
        }
      },
      reviewHistory: []
    };

    setUploadedFiles(prev => prev.map(f => 
      f.id === uploadedFile.id 
        ? { 
            ...f, 
            status: 'completed' as const, 
            progress: 100,
            uploadedFile: excelFile
          }
        : f
    ));

    // Notify parent component
    onFilesUploaded([excelFile]);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const event = {
        target: {
          files: e.dataTransfer.files
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className="border border-white/30 bg-gradient-to-br from-blue-50 via-sky-100 to-cyan-100 backdrop-blur-md dark:from-blue-950/20 dark:via-sky-900/20 dark:to-cyan-900/20 dark:border-white/20">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Excel Files
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Drag and drop your Excel files here, or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              border-blue-300 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file"
              multiple
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled}
            />
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-blue-900 dark:text-blue-100">
                  Choose files or drag and drop
                </p>
                <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                  Excel files (.xlsx, .xls) up to {formatFileSize(MAX_FILE_SIZE)}
                </p>
                <p className="text-xs text-blue-600/60 dark:text-blue-400/60 mt-2">
                  Maximum {maxFiles} files per upload
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card className="border border-white/30 bg-gradient-to-br from-green-50 via-emerald-100 to-teal-100 backdrop-blur-md dark:from-green-950/20 dark:via-emerald-900/20 dark:to-teal-900/20 dark:border-white/20">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Files ({uploadedFiles.length})
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Files ready for review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((uploadedFile) => (
                <div key={uploadedFile.id} className="flex items-center justify-between p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 dark:bg-white/20 dark:border-white/20">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-full bg-green-500/20">
                      {uploadedFile.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : uploadedFile.status === 'error' ? (
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      ) : (
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 dark:text-green-100">
                        {uploadedFile.file.name}
                      </h4>
                      <p className="text-sm text-green-700/80 dark:text-green-300/80">
                        {formatFileSize(uploadedFile.file.size)} • {uploadedFile.file.type}
                      </p>
                      {uploadedFile.status === 'uploading' && (
                        <div className="mt-2">
                          <Progress value={uploadedFile.progress} className="h-2" />
                          <p className="text-xs text-green-600/60 dark:text-green-400/60 mt-1">
                            Uploading... {uploadedFile.progress}%
                          </p>
                        </div>
                      )}
                      {uploadedFile.status === 'error' && uploadedFile.error && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {uploadedFile.error}
                        </p>
                      )}
                      {uploadedFile.status === 'completed' && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="default" className="bg-green-500 text-white">
                            Ready for Review
                          </Badge>
                          {uploadedFile.uploadedFile && (
                            <Badge variant="outline" className="text-green-700 border-green-500">
                              ID: {uploadedFile.uploadedFile.id}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {uploadedFile.status === 'completed' && uploadedFile.uploadedFile && (
                      <>
                        <Button size="sm" variant="ghost" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeFile(uploadedFile.id)}
                      disabled={uploadedFile.status === 'uploading'}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Summary */}
      {uploadedFiles.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 dark:border-white/20">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-900 dark:text-blue-100">
              {uploadedFiles.filter(f => f.status === 'completed').length} of {uploadedFiles.length} files uploaded successfully
            </span>
          </div>
          {isUploading && (
            <Badge variant="outline" className="border-blue-500 text-blue-700">
              Uploading...
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
