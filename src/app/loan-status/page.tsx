'use client'
import React, { useEffect, useState } from 'react'
import { FileText, Clock, CheckCircle, ChevronRight, FileCheck, } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { UploadDocumentsModal } from './UploadDocumentsModal'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { Document, Application, Offer } from '@/types/user'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { DashboardBack } from '@/components/dashboard-back'


export default function LoanStatus() {

  const { user, loading } = useAuth();
  const router = useRouter();

  const [currentApplication, setCurrentApplication] = useState<Application | null>(null);
  const [applicationHistory, setApplicationHistory] = useState<Application[]>([]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false)
  const [selectedOffer, setSelectedOffer] = React.useState<Offer | null>(null)
  const [isOfferDetailsOpen, setIsOfferDetailsOpen] = React.useState(false)
  const [isStipUploadOpen, setIsStipUploadOpen] = React.useState(false)

  const [documents, setDocuments] = React.useState<Document[]>([
    { name: 'Banking Statements ', status: 'pending' },
    { name: 'Tax Returns', status: 'pending' },
    { name: 'Profit & Loss Statement', status: 'pending' },
    { name: 'Balance Sheet', status: 'pending' },
  ])
  const [hasPendingDocuments, setHasPendingDocuments] = useState(true);
  const [currentOffers] = React.useState<Offer[]>([
    {
      lender: "ABC Bank",
      amount: "45000",
      rate: "5.5%",
      term: "5 years",
      prepaymentPenalty: "2% for first 2 years",
      payment: "215",
      paymentFrequency: "Weekly",
      status: "Action Needed",
      stips: [
        { name: "Proof of Insurance", status: "pending" },
        { name: "Bank Statements (Last 3 months)", status: "uploaded" },
      ]
    },
    {
      lender: "XYZ Financial",
      amount: "50000",
      rate: "6%",
      term: "7 years",
      prepaymentPenalty: "None",
      payment: "180",
      paymentFrequency: "Weekly",
      status: "Funding",
      stips: []
    },
    {
      lender: "123 Loans",
      amount: "40000",
      rate: "5.75%",
      term: "4 years",
      prepaymentPenalty: "1% for first year",
      payment: "230",
      paymentFrequency: "Weekly",
      status: "Declined",
      stips: []
    },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    const fetchApplicationData = async () => {
      const user = auth.currentUser

      if (user) {
        try {
          // Fetch the most recent application in progress
          const applicationsRef = collection(db, 'users', user.uid, 'applications');
          const inProgressQuery = query(applicationsRef, where('status', '==', 'In Progress'));

          const querySnapshot = await getDocs(inProgressQuery);

          if (!querySnapshot.empty) {
            const applicationDoc = querySnapshot.docs[0];
            setCurrentApplication({
              id: applicationDoc.id,
              ...(applicationDoc.data() as Application),
            });
          } else {
            console.log('No in-progress application found.');
            setCurrentApplication(null);
          }

          // Fetch application history
          const historyRef = collection(db, 'users', user.uid, 'applications');
          const historyQuery = query(historyRef, orderBy('submissionDate', 'desc'), limit(10));
          const historySnap = await getDocs(historyQuery);

          if (!historySnap.empty) {
            const history = historySnap.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as Application),
            }));
            setApplicationHistory(history);
          } else {
            console.log('No application history found.');
            setApplicationHistory([]);
          }
        } catch (error) {
          console.error('Error fetching application data:', error);
        }
      }
    }
    if (user) {
      fetchApplicationData()
      checkExistingFiles()
    }

  }, [user, loading, router,isUploadModalOpen]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleAcceptOffer = (offer: Offer | null) => {
    if (offer) {
      setSelectedOffer(offer);
      setIsOfferDetailsOpen(true);
    } else {
      console.warn("Attempted to accept an invalid offer");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Action Needed":
        return <Badge variant="warning">Action Needed</Badge>
      case "Funding":
        return <Badge variant="success">Funding</Badge>
      case "Declined":
        return <Badge variant="destructive">Declined</Badge>
      default:
        return null
    }
  }

  const handleUploadStip = (offer: Offer | null) => {
    setSelectedOffer(offer)
    setIsStipUploadOpen(true)
  }

  const checkExistingFiles = async () => {
    const storage = getStorage()
    const updatedDocuments: Document[] = await Promise.all(
      documents.map(async (doc): Promise<Document> => {
        const fileRef = ref(storage, `user_files/${user.uid}/${doc.name}`)
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

    const anyPending = updatedDocuments.some((doc) => doc.status === 'pending');
    setHasPendingDocuments(anyPending);

  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        {/* Navigation bar code (same as before) */}
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Loan Application Status</h1>

          {currentApplication && <Card className="mb-6">
            <CardHeader>
              <CardTitle>Current Application</CardTitle>
              <CardDescription>Status of your most recent loan application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Business Expansion Loan</h3>
                  <p className="text-sm text-gray-500">Application #{currentApplication.id}</p>
                </div>
                <Badge variant="secondary">In Progress</Badge>
              </div>
              <Progress value={66} className="mb-2" />
              <div className="text-sm text-gray-500 mb-4">Application is 66% complete</div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Business Information Submitted</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Financial Documents Uploaded</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  <span>Application Submitted</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                Continue Application
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Please ensure all required documents are submitted</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc.name} className="flex items-center">
                    {doc.status === 'uploaded' ? (
                      <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span>{doc.name}</span>
                  </li>
                ))}
              </ul>

            </CardContent>
            <CardFooter>
              {hasPendingDocuments && (
                <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
                  Upload Missing Documents
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}

            </CardFooter>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Lender Offers</CardTitle>
              <CardDescription>Current offers for your loan application</CardDescription>
            </CardHeader>
            <CardContent>
              {currentOffers && currentOffers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lender</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOffers.map((offer, index) => (
                      <TableRow key={index}>
                        <TableCell>{offer.lender}</TableCell>
                        <TableCell>${offer.amount.toLocaleString()}</TableCell>
                        <TableCell>{offer.rate}</TableCell>
                        <TableCell>{offer.term}</TableCell>
                        <TableCell>{getStatusBadge(offer.status)}</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => handleAcceptOffer(offer)}>
                            View Details
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>${`No offers available yet. We'll notify you when lenders respond to your application.`}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application History</CardTitle>
              <CardDescription>Your past loan applications and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#ID</TableHead>
                    <TableHead>Lender</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicationHistory.map((application, index) => (
                    <TableRow key={index}>
                      <TableCell>#{application.id}</TableCell>
                      <TableCell>{application.legalName}</TableCell>
                      <TableCell>{application.submissionDate?.toDate().toLocaleDateString()}</TableCell>
                      <TableCell>${application.loanAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={application.status === "Approved" ? "success" : "destructive"}>
                          {application.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <DashboardBack />

      </main>

      <UploadDocumentsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        userId={user.uid}
      />

      <Dialog open={isOfferDetailsOpen} onOpenChange={setIsOfferDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Offer Details</DialogTitle>
            <DialogDescription>Review the details of the selected offer</DialogDescription>
          </DialogHeader>
          {selectedOffer && (
            <div className="py-4">
              <p><strong>Lender:</strong> {selectedOffer.lender}</p>
              <p><strong>Amount:</strong> ${selectedOffer.amount.toLocaleString()}</p>
              <p><strong>Interest Rate:</strong> {selectedOffer.rate}</p>
              <p><strong>Term:</strong> {selectedOffer.term}</p>
              <p><strong>Pre-payment Penalty:</strong> {selectedOffer.prepaymentPenalty}</p>
              <p><strong>Payment:</strong> ${selectedOffer.payment}</p>
              <p><strong>Payment Frequency:</strong> {selectedOffer.paymentFrequency}</p>
              <p><strong>Status:</strong> {selectedOffer.status}</p>
              {selectedOffer.stips && selectedOffer.stips.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Additional Documents Required:</h4>
                  <ul className="list-disc pl-5">
                    {selectedOffer?.stips.map((stip, index) => (
                      <li key={index} className="mb-2">
                        {stip.name} - {stip.status}
                        {stip.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-2"
                            onClick={() => handleUploadStip(selectedOffer)}
                          >
                            Upload
                          </Button>
                        )}
                      </li>
                    ))}

                  </ul>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsOfferDetailsOpen(false)}>Close</Button>
            <Button variant="default">Accept Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isStipUploadOpen} onOpenChange={setIsStipUploadOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Additional Document</DialogTitle>
            <DialogDescription>Please upload the requested document for {selectedOffer?.lender}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stipFile" className="text-right">
                File
              </Label>
              <Input id="stipFile" type="file" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => setIsStipUploadOpen(false)}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}