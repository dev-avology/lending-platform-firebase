import { useEffect, useState } from "react";
import { mergePDFs, stringToURL } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { initialDocuments, Document, DocumentStatus } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, CheckCircle2, Clock, HelpCircle, Upload, ViewIcon, X } from "lucide-react";
import Link from "next/link";
import { getStatement, getStatementList } from "@/lib/plaid";
import { firebaseService } from "@/lib/firebaseService";
import { useBankAccounts } from "@/contexts/BankAccountsContext";

interface RequiredDocumentsProps {
  onUpdate: (value: boolean) => void;
}

export function RequiredDocuments({ onUpdate }: RequiredDocumentsProps) {
  const { user, loading } = useAuth();
  const { accounts, loading: accountLoading } = useBankAccounts();

  const [requiredDocuments, setRequiredDocuments] = useState<Document[]>(initialDocuments);
  const [hasPendingDocuments, setHasPendingDocuments] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {

    if (user) checkExistingFiles();
    
    onUpdate(hasPendingDocuments);

  }, [user, hasPendingDocuments]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  const updateDocumentStatus = (documentName: string, updates: Partial<Document>) => {
    setRequiredDocuments((docs) =>
      docs.map((doc) => (doc.name === documentName ? { ...doc, ...updates } : doc))
    );
  };

  const handleFileUpload = async (documentName: string) => {
    if (!user) return;


    updateDocumentStatus(documentName, { status: "uploading", progress: 0 });
    setUploading(true);
    
    // if(accounts.length){
    //     // Find the first account with a valid `status`
    //     const firstValidAccount = accounts.find(account => account.status);

    //       console.log(firstValidAccount);

    //     // Extract the accessToken if the account exists
    //     const accessToken = firstValidAccount?.access_token;

    //     if (accessToken) {
    //         console.log("Access token of the first valid account:", accessToken);
    //         const fileurl =  await handlePlaidStatements(accessToken,user.uid,documentName);
    //         updateDocumentStatus(documentName, { status: "uploaded", progress: undefined, downloadUrl: fileurl });
    //         setUploading(false);
    //        return;
    //     } else {
    //         console.log("No valid account found.");
    //     }
    // }



    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "*/*";

    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `user_files/${user.uid}/${documentName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            updateDocumentStatus(documentName, { progress });
          },
          (error) => {
            console.error("Upload failed:", error);
            updateDocumentStatus(documentName, { status: "error", progress: undefined });
            setUploading(false);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              updateDocumentStatus(documentName, { status: "uploaded", progress: undefined, downloadUrl: downloadURL });
            } catch {
              console.error("Error getting download URL");
              updateDocumentStatus(documentName, { status: "error" });
            } finally {
              setUploading(false);
            }
          }
        );
      }
    };

    fileInput.click();
  };

  const checkExistingFiles = async () => {
    if (!user) return;

    const storage = getStorage();
    const updatedDocuments: Document[] = await Promise.all(
      requiredDocuments.map(async (doc) => {
        const fileRef = ref(storage, `user_files/${user.uid}/${doc.name}`);
        try {
          const url = await getDownloadURL(fileRef);
          return { ...doc, status: "uploaded", downloadUrl: url };
        } catch {
          return { ...doc, status: "pending" };
        }
      })
    );

    setRequiredDocuments(updatedDocuments);

    setHasPendingDocuments(updatedDocuments.some((doc) => doc.status === "pending"));
  };

  const getDocumentStatusIcon = (status: DocumentStatus) => {
    const icons = {
      submitted: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      uploaded: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      pending: <Clock className="w-5 h-5 text-yellow-500" />,
      uploading: <Upload className="w-5 h-5 text-blue-500" />,
      not_required: <HelpCircle className="w-5 h-5 text-gray-300" />,
      error: <X className="w-5 h-5 text-red-500" />,
    };
    return icons[status] || <AlertTriangle className="w-5 h-5 text-red-500" />;
  };


  const handlePlaidStatements = async (accessToken: string,userId: string, fileName: string): Promise<(string)> => {
    try {
        const { accounts } = await getStatementList(accessToken);

        // Fetch all statements concurrently
        const statements = await Promise.all(
            accounts.flatMap(account =>
                account.statements.map(async statement =>
                   await getStatement(accessToken, statement.statement_id)
                )
            )
        );

        const mergedPdfBytes: Uint8Array = await mergePDFs(statements);

        const downloadUrl: string = await firebaseService.uploadToFirebaseStorage(`user_files/${user.uid}/${fileName}`, mergedPdfBytes);

        return downloadUrl;

    } catch (error) {
        console.error("Error fetching Plaid statements:", error);
        throw error;
    }
};



  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requiredDocuments.map((doc) => (
              <TableRow key={doc.name}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getDocumentStatusIcon(doc.status)}
                    <span className="ml-2 capitalize">{doc.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {doc.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleFileUpload(doc.name)}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  )}
                  {doc.status === "uploading" && (
                    <div className="w-full">
                      <Progress value={doc.progress} className="w-full" />
                    </div>
                  )}
                  {doc.status === "uploaded" && doc.downloadUrl && (
                    <div className="flex items-center">
                      <Link href={stringToURL(doc.downloadUrl)?.href || "#"} target="_blank">
                        <ViewIcon className="w-full" />
                      </Link>
                    </div>
                  )}
                  {doc.status === "error" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => updateDocumentStatus(doc.name, { status: "pending" })}
                    >
                      Retry
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
