/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { use } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, AlertTriangle, FileText, Edit2, Lock } from 'lucide-react'

export default function Page({ params }: { params: Promise<{ slug: string }> }) {

    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)

    const unwrappedParams = use(params) // Unwrap the Promise
    const slug = unwrappedParams.slug

    const [application, setApplication] = useState({
        id: 'slug',
        businessName: 'TechStart Solutions',
        applicantName: 'John Doe',
        loanAmount: 100000,
        loanPurpose: 'Equipment Purchase',
        creditScore: 720,
        annualRevenue: 500000,
        yearsInBusiness: 3,
        ssn: '123-45-6789',
        ein: '12-3456789',
        documents: [
            { name: 'Business Tax Returns', status: 'submitted' },
            { name: 'Personal Tax Returns', status: 'submitted' },
            { name: 'Bank Statements', status: 'submitted' },
            { name: 'Financial Projections', status: 'pending' },
            { name: 'Business Plan', status: 'not_required' },
        ],
        riskAssessment: {
            creditRisk: 'Low',
            businessStability: 'Medium',
            marketConditions: 'Favorable',
            overallRisk: 'Low to Medium',
        },
    })

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        setIsEditing(false)
        toast({
            title: "Changes Saved",
            description: "Your application has been updated.",
        })
    }

    const handleConfirm = () => {
        setIsConfirmed(true)
        toast({
            title: "Application Confirmed",
            description: "Your application has been confirmed and submitted for review.",
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setApplication(prev => ({ ...prev, [name]: value }))
    }

    const getDocumentStatusIcon = (status: string) => {
        switch (status) {
            case 'submitted':
                return <CheckCircle2 className="w-5 h-5 text-green-500" />
            case 'pending':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />
            case 'not_required':
                return <XCircle className="w-5 h-5 text-gray-300" />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md">
                {/* Navigation bar code (same as in Dashboard.tsx) */}
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

                <h1 className="text-3xl font-bold mb-6">Review Loan Application</h1>

                <div className="grid gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Summary</CardTitle>
                            <CardDescription>Application ID: {application.id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="businessName">Business Name</Label>
                                    <Input
                                        id="businessName"
                                        name="businessName"
                                        value={application.businessName}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="applicantName">Applicant Name</Label>
                                    <Input
                                        id="applicantName"
                                        name="applicantName"
                                        value={application.applicantName}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="loanAmount">Loan Amount</Label>
                                    <Input
                                        id="loanAmount"
                                        name="loanAmount"
                                        value={application.loanAmount}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        type="number"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="loanPurpose">Loan Purpose</Label>
                                    <Input
                                        id="loanPurpose"
                                        name="loanPurpose"
                                        value={application.loanPurpose}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="creditScore">Credit Score</Label>
                                    <Input
                                        id="creditScore"
                                        name="creditScore"
                                        value={application.creditScore}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        type="number"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="annualRevenue">Annual Revenue</Label>
                                    <Input
                                        id="annualRevenue"
                                        name="annualRevenue"
                                        value={application.annualRevenue}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        type="number"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="yearsInBusiness">Years in Business</Label>
                                    <Input
                                        id="yearsInBusiness"
                                        name="yearsInBusiness"
                                        value={application.yearsInBusiness}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        type="number"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ssn">SSN</Label>
                                    <div className="relative">
                                        <Input
                                            id="ssn"
                                            name="ssn"
                                            value={application.ssn}
                                            readOnly
                                        />
                                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">Contact support to update SSN</p>
                                </div>
                                <div>
                                    <Label htmlFor="ein">EIN</Label>
                                    <div className="relative">
                                        <Input
                                            id="ein"
                                            name="ein"
                                            value={application.ein}
                                            readOnly
                                        />
                                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">Contact support to update EIN</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {!isEditing && !isConfirmed && (
                                <Button onClick={handleEdit}>
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit Application
                                </Button>
                            )}
                            {isEditing && (
                                <Button onClick={handleSave}>
                                    Save Changes
                                </Button>
                            )}
                            {!isConfirmed && (
                                <Button onClick={handleConfirm} disabled={isEditing}>
                                    Confirm Application
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    <Tabs defaultValue="documents">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="documents">Required Documents</TabsTrigger>
                            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                        </TabsList>
                        <TabsContent value="documents">
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
                                            {application.documents.map((doc, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{doc.name}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            {getDocumentStatusIcon(doc.status)}
                                                            <span className="ml-2 capitalize">{doc.status}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {doc.status === 'submitted' && (
                                                            <Button variant="outline" size="sm">
                                                                <FileText className="w-4 h-4 mr-2" />
                                                                View
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="risk">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Risk Assessment</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableBody>
                                            {Object.entries(application.riskAssessment).map(([key, value]) => (
                                                <TableRow key={key}>
                                                    <TableCell className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</TableCell>
                                                    <TableCell>{value}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {isConfirmed && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Confirmed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Thank you for confirming your application. It has been submitted for review. We will contact you with updates on your application status.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    )
}