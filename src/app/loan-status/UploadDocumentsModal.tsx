import React from 'react'
import { Upload, FileText, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { Document } from '@/types/user'

interface UploadDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string; // Add userId as a prop
}

export function UploadDocumentsModal({ isOpen, onClose, userId }: UploadDocumentsModalProps) {

  const [documents, setDocuments] = React.useState<Document[]>([
    { name: 'Banking Statements ', status: 'pending' },
    { name: 'Tax Returns', status: 'pending' },
    { name: 'Profit & Loss Statement', status: 'pending' },
    { name: 'Balance Sheet', status: 'pending' },
  ])

  const [uploading, setUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)

  React.useEffect(() => {
    if (isOpen) {
      checkExistingFiles()
    }
  }, [isOpen])

  const checkExistingFiles = async () => {
    const storage = getStorage()
    const updatedDocuments: Document[] = await Promise.all(
      documents.map(async (doc): Promise<Document> => {
        const fileRef = ref(storage, `user_files/${userId}/${doc.name}`)
        try {
          await getDownloadURL(fileRef)
          return { ...doc, status: 'uploaded' }
        } catch {
          // File does not exist
          return { ...doc, status: 'pending' } 
        }
      })
    )
    setDocuments(updatedDocuments)
  }
  

  const handleFileUpload = async (documentName: string) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '*/*'
    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        const storage = getStorage()
        const storageRef = ref(storage, `user_files/${userId}/${documentName}`)
        const uploadTask = uploadBytesResumable(storageRef, file)

        setUploading(true)
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setUploadProgress(progress)
          },
          (error) => {
            console.error('Upload failed:', error)
            setUploading(false)
          },
          () => {
            setUploading(false)
            setUploadProgress(0)
            setDocuments((docs) =>
              docs.map((doc) =>
                doc.name === documentName ? { ...doc, status: 'uploaded' } : doc
              )
            )
          }
        )
      }
    }
    fileInput.click()
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
            <p className="text-sm text-gray-500 mt-2">Uploading... {uploadProgress.toFixed(0)}%</p>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
