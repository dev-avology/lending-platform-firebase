'use client';
import React from 'react'
import { Upload, FileText, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface Document {
  name: string;
  status: 'pending' | 'uploaded';
}

interface UploadDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadDocumentsModal({ isOpen, onClose }: UploadDocumentsModalProps) {
  const [documents, setDocuments] = React.useState<Document[]>([
    { name: 'Banking Statements', status: 'uploaded' },
    { name: 'Tax Returns', status: 'uploaded' },
    { name: 'Profit & Loss Statement', status: 'pending' },
    { name: 'Balance Sheet', status: 'pending' },
  ])

  const [uploading, setUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)

  const handleFileUpload = (documentName: string) => {
    setUploading(true)
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setUploading(false)
        setUploadProgress(0)
        setDocuments(docs => docs.map(doc => 
          doc.name === documentName ? { ...doc, status: 'uploaded' } : doc
        ))
      }
    }, 500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Missing Documents</DialogTitle>
          <DialogDescription>
            Please upload the required documents for your loan application.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {documents.map((doc) => (
            <div key={doc.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {doc.status === 'uploaded' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <FileText className="h-5 w-5 text-gray-400" />
                )}
                <span>{doc.name}</span>
              </div>
              {doc.status === 'pending' && (
                <Button 
                  size="sm" 
                  onClick={() => handleFileUpload(doc.name)}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              )}
            </div>
          ))}
        </div>
        {uploading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">Uploading... {uploadProgress}%</p>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}