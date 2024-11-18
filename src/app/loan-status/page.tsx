'use client'
import React, { useEffect, useState } from 'react'
import { FileText, Clock, CheckCircle, ChevronRight, FileCheck,} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { UploadDocumentsModal } from './UploadDocumentsModal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { auth, db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore'


export default function LoanStatus() {

  const { user, loading } = useAuth();
  const router = useRouter();

  const [currentApplication, setCurrentApplication] = useState(null)
  const [applicationHistory, setApplicationHistory] = useState([])
  
  const [isOpen, setIsOpen] = React.useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false)
  const [selectedOffer, setSelectedOffer] = React.useState(null)
  const [isOfferDetailsOpen, setIsOfferDetailsOpen] = React.useState(false)
  const [isStipUploadOpen, setIsStipUploadOpen] = React.useState(false)

  const currentOffers = [
    { 
      lender: "ABC Bank", 
      amount: 45000, 
      rate: "5.5%", 
      term: "5 years", 
      prepaymentPenalty: "2% for first 2 years", 
      payment: 215, 
      paymentFrequency: "Weekly",
      status: "Action Needed",
      stips: [
        { name: "Proof of Insurance", status: "Pending" },
        { name: "Bank Statements (Last 3 months)", status: "Uploaded" },
      ]
    },
    { 
      lender: "XYZ Financial", 
      amount: 50000, 
      rate: "6%", 
      term: "7 years", 
      prepaymentPenalty: "None", 
      payment: 180, 
      paymentFrequency: "Weekly",
      status: "Funding",
      stips: []
    },
    { 
      lender: "123 Loans", 
      amount: 40000, 
      rate: "5.75%", 
      term: "4 years", 
      prepaymentPenalty: "1% for first year", 
      payment: 230, 
      paymentFrequency: "Weekly",
      status: "Declined",
      stips: []
    },
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    
    const fetchApplicationData = async () => {
      const user = auth.currentUser

      if (user) {
        // Fetch the most recent application
        const applicationsRef = collection(db, 'users', user.uid, 'applications');


        const inProgressQuery = query(applicationsRef, where('status', '==', 'In Progress'));

        const querySnapshot = await getDocs(inProgressQuery);

        console.log(querySnapshot);

        if (!querySnapshot.empty) {
          const applicationDoc = querySnapshot.docs[0];
          setCurrentApplication({ id: applicationDoc.id, ...applicationDoc.data() });
          console.log('In-progress application found:', currentApplication);
        }
       
        // Fetch application history
        const historyRef = collection(db, 'users', user.uid, 'applications')
        const historyQuery = query(historyRef, orderBy('submissionDate', 'desc'), limit(10))
        const historySnap = await getDocs(historyQuery)
        
        const history = historySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setApplicationHistory(history);

        console.log('ddddddddd',applicationHistory);
      }
    }
    if(user){
      fetchApplicationData()
    }

  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleAcceptOffer = (offer: React.SetStateAction<null>) => {
    setSelectedOffer(offer)
    setIsOfferDetailsOpen(true)
  }

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

  const handleUploadStip = (offer: React.SetStateAction<null>) => {
    setSelectedOffer(offer)
    setIsStipUploadOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        {/* Navigation bar code (same as before) */}
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Loan Application Status</h1>

          {currentApplication &&  <Card className="mb-6">
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
                <li className="flex items-center">
                  <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                  <span>Banking Statements</span>
                </li>
                <li className="flex items-center">
                  <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                  <span>Tax Returns</span>
                </li>
                <li className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span>Profit & Loss Statement</span>
                </li>
                <li className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span>Balance Sheet</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
                Upload Missing Documents
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
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
            <div className="flex justify-between w-full">
            <span>Application ID</span>
            <span>Legal Name</span>
            <span>Submission date</span>
            <span>Amount</span>
            <span>Status</span>
            </div>  
              <Accordion type="single" collapsible className="w-full">
                {applicationHistory.map((application,index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                      <div className="flex justify-between w-full">
                      <span>{application.id}</span>
                      <span>{application.legalName}</span>
                      <span>{application.submissionDate?.toDate().toLocaleDateString()}</span>
                        <span>${application.loanAmount.toLocaleString()}</span>
                        <Badge variant={application.status === "Approved" ? "success" : "destructive"}>
                          {application.status}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4">
                        <h4 className="font-semibold mb-2">Lender Offers</h4>
                          <p>No offers were received for this application.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">

          <Link href="/dashboard" className="flex items-center text-gray-900 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            Back to Dashboard
          </Link>
        </div>

      </main>

      <UploadDocumentsModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
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
                    {selectedOffer.stips.map((stip: { name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; status: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined }, index: React.Key | null | undefined) => (
                      <li key={index} className="mb-2">
                        {stip.name} - {stip.status}
                        {stip.status === "Pending" && (
                          <Button size="sm" variant="outline" className="ml-2" onClick={() => handleUploadStip(selectedOffer)}>
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