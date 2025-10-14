'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

export function FlightUploadDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus('idle');
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.txt'] },
    multiple: false,
  });

  const handleUpload = () => {
    if (!file) return;

    setStatus('uploading');
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setStatus('processing');
          setTimeout(() => {
            // Simulate processing result
            const success = Math.random() > 0.2; // 80% success rate
            setStatus(success ? 'success' : 'error');
          }, 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  const reset = () => {
    setFile(null);
    setUploadProgress(0);
    setStatus('idle');
  };
  
  const handleDialogClose = (isOpen: boolean) => {
    if(!isOpen) {
      reset();
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Upload Flight Log</DialogTitle>
          <DialogDescription>
            Upload your DJI .txt flight log file to start the analysis.
          </DialogDescription>
        </DialogHeader>

        {!file && (
          <div
            {...getRootProps()}
            className={`mt-4 flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed
            ${isDragActive ? 'border-primary bg-accent' : 'border-border'}`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mb-2 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">
              {isDragActive ? 'Drop the file here' : "Drag 'n' drop a file here, or click to select"}
            </p>
            <p className="text-xs text-muted-foreground">DJI .txt files only</p>
          </div>
        )}

        {file && (
          <div className="mt-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={reset}>
                Remove
              </Button>
            </div>

            {status === 'uploading' && (
              <div className="mt-4">
                <Progress value={uploadProgress} />
                <p className="mt-2 text-center text-sm text-muted-foreground">Uploading...</p>
              </div>
            )}

            {status === 'processing' && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Processing flight data...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="mt-4 flex flex-col items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-10 w-10" />
                <p className="font-medium">Upload successful!</p>
                <p className="text-sm text-center text-muted-foreground">Your flight is being analyzed. You can close this window.</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="mt-4 flex flex-col items-center justify-center gap-2 text-destructive">
                <AlertTriangle className="h-10 w-10" />
                <p className="font-medium">Upload Failed</p>
                <p className="text-sm text-center text-muted-foreground">Please try again. Ensure the file is a valid .txt log.</p>
              </div>
            )}

          </div>
        )}

        <DialogFooter>
          {status === 'idle' && file && <Button onClick={handleUpload}>Upload and Process</Button>}
          {(status === 'success' || status === 'error') && <DialogClose asChild><Button onClick={reset}>Done</Button></DialogClose>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
