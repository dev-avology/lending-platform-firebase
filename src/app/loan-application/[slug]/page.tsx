/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { use, useEffect } from 'react'
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
import { firebaseService } from '@/lib/firebaseService'
import { useAuth } from '@/contexts/AuthContext'
import { Application, initialApplication } from '@/types/user'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { DashboardBack } from '@/components/dashboard-back'


interface FieldProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean; // Corrected prop name
}

const Field: React.FC<FieldProps> = ({
    id,
    label,
    type = 'text',
    value,
    error,
    onChange,
    readOnly = false, // Default value corrected
}) => (
    <div>
        <Label htmlFor={id}>{label}</Label>
        <Input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={`${id}-error`}
            readOnly={readOnly} // Used corrected prop here
        />
        {error && (
            <p id={`${id}-error`} className="text-red-500 text-sm mt-1">
                {error}
            </p>
        )}
    </div>
);

interface RadioOption {
    value: string;
    label: string;
}

const renderRadioGroup = (
    label: string,
    name: string,
    options: RadioOption[],
    defaultValue: string, // Renamed to avoid conflict with reserved keyword
    readOnly?: boolean // Corrected prop name
): JSX.Element => (
    <div>
        <Label>{label}</Label>
        <RadioGroup defaultValue={defaultValue} className="flex space-x-4" disabled={readOnly}>
            {options.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`${name}${value}`} />
                    <Label htmlFor={`${name}${value}`}>{label}</Label>
                </div>
            ))}
        </RadioGroup>
    </div>
);


export default function Page({ params }: { params: Promise<{ slug: string }> }) {

    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const { user } = useAuth();

    const unwrappedParams = use(params) // Unwrap the Promise
    const slug = unwrappedParams.slug

    const [application, setApplication] = useState<Application>(initialApplication)



    const fetchApplication = async () => {
        if (!user) return;

        try {
            // Fetch the pending application with the given condition
            const currentApplication = await firebaseService.getRecord(`users/${user.uid}/applications`, slug);

            // Set the application ID or null if not found
            if (currentApplication)
                setApplication(currentApplication);

            console.log(currentApplication);

        } catch (error) {
            console.error("Error fetching the current application:", error);
        }
    };

    useEffect(() => {
        fetchApplication();
    }, [slug, user]);


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

                                <Field id="businessName" label="Business Name" value={application.legalName} onChange={handleInputChange} readOnly={!isEditing} />

                                <div>
                                    <Label htmlFor="entityType">Legal Entity Type</Label>
                                    <Select name="entityType" value={application.entityType} disabled={!isEditing}>
                                        <SelectTrigger id="entityType">
                                            <SelectValue placeholder="Select entity type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="llc">LLC</SelectItem>
                                            <SelectItem value="corporation">Corporation</SelectItem>
                                            <SelectItem value="partnership">Partnership</SelectItem>
                                            <SelectItem value="soleProprietorship">Sole Proprietorship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Field id="stateInception" label="State of Inception" value={application.stateInception} onChange={handleInputChange} readOnly={!isEditing} />
                                <Field id="inceptionDate" type="date" label="Business Inception Date" value={application.inceptionDate} onChange={handleInputChange} readOnly={!isEditing} />
                                <Field id="federalTaxId" label="Federal Tax ID" value={application.federalTaxId} onChange={handleInputChange} readOnly={!isEditing} />
                                <Field id="businessPhone" label="Business Phone" value={application.businessPhone} onChange={handleInputChange} />
                                <Field id="physicalAddress" label="Physical Address" value={application.physicalAddress} onChange={handleInputChange} readOnly={!isEditing} />

                                <Field id="city" label="City" value={application.city} onChange={handleInputChange} readOnly={!isEditing} />
                                <Field id="state" label="State" value={application.state} onChange={handleInputChange} readOnly={!isEditing} />
                                <Field id="zipCode" label="Zip Code" value={application.zipCode} onChange={handleInputChange} readOnly={!isEditing} />
                                <Field id="businessEmail" label="Business Email" value={application.businessEmail} onChange={handleInputChange} readOnly={!isEditing} />

                                {renderRadioGroup('Any Existing Cash Advances?', 'existingCashAdvances', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },], application.existingCashAdvances, !isEditing)}

                                {application.existingCashAdvances === 'yes' && <>

                                    <Field id="advanceBalance" label="Balance of Current Advances" value={application.advanceBalance} onChange={handleInputChange} readOnly={!isEditing} />
                                    <Field id="fundingCompanies" label="Funding Companies" value={application.fundingCompanies} onChange={handleInputChange} readOnly={!isEditing} />
                                </>
                                }

                                {renderRadioGroup('Business Tax Liens?', 'taxLiens', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },], application.taxLiens, !isEditing)}


                                {renderRadioGroup('Tax Lien Payment Plan?', 'taxLienPlan', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },], application.taxLienPlan, !isEditing)}

                                {renderRadioGroup('Filed for Bankruptcy Within Last 2 Years?', 'bankruptcy', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },], application.bankruptcy, !isEditing)}


                                {renderRadioGroup('Business Home Based?', 'homeBased', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },], application.homeBased, !isEditing)}

                                {renderRadioGroup('Rent or Own Home?', 'homeOwnership', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },], application.homeOwnership, !isEditing)}

                                <Field
                                    id="homePayment"
                                    label="Home Monthly Payment"
                                    value={application.homePayment}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                />


                                {renderRadioGroup('Own Business Property?', 'ownBusinessProperty', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },], application.ownBusinessProperty, !isEditing)}

                                <Field
                                    id="businessPropertyPayment"
                                    label="Business Property Monthly Payment"
                                    value={application.businessPropertyPayment}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                />

                                <Field
                                    id="landlordName"
                                    label="Landlord Name"
                                    value={application.landlordName}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                />

                                <div>
                                    <Label htmlFor="industryType">Industry Type</Label>
                                    <Select name="industryType" value={application.industryType} disabled={!isEditing}>
                                        <SelectTrigger id="industryType">
                                            <SelectValue placeholder="Select industry type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="retail">Retail</SelectItem>
                                            <SelectItem value="technology">Technology</SelectItem>
                                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                            <SelectItem value="services">Services</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
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

                    {/* <Tabs defaultValue="documents">
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
                    </Tabs> */}

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
                <DashboardBack />
            </main>
        </div>
    )
}