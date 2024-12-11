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
import { toast } from '@/hooks/use-toast'
import {  Edit2, ChevronLeft, ChevronRight } from 'lucide-react'
import { firebaseService } from '@/lib/firebaseService'
import { useAuth } from '@/contexts/AuthContext'
import { Application, initialApplication, initialDocuments, Document } from '@/types/user'
import { DashboardBack } from '@/components/dashboard-back'
import { CompanyInformation } from '../company-information'
import { FinancialInformation } from '../financial-information'
import { OwnerInformation } from '../owner-information'
import { Timestamp } from 'firebase/firestore'
import { RequiredDocuments } from '@/components/requiredDocuments'

export default function Page({ params }: { params: Promise<{ slug: string }> }) {

    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const { user, loading } = useAuth();

    const unwrappedParams = use(params) // Unwrap the Promise
    const slug = unwrappedParams.slug

    type StepFields = {
        0: 'legalName' | 'entityType' | 'stateInception' | 'inceptionDate' | 'businessPhone' | 'federalTaxId' | 'physicalAddress' | 'city' | 'state' | 'zipCode' | 'businessEmail' | 'existingCashAdvances' | 'advanceBalance' | 'fundingCompanies' | 'taxLiens' | 'taxLienPlan' | 'bankruptcy' | 'homeBased' | 'homeOwnership' | 'homePayment' | 'ownBusinessProperty' | 'businessPropertyPayment' | 'landlordName' | 'industryType';
        1: 'grossAnnualSales' | 'averageMonthlySales' | 'lastMonthSales' | 'businessBankName' | 'creditCardProcessor' | 'averageMonthlyCreditCardSales';
        2: 'firstName' | 'lastName' | 'dateOfBirth' | 'ssn' | 'driversLicense' | 'officerTitle' | 'ownershipPercentage' | 'homeAddress' | 'ownerCity' | 'ownerState' | 'ownerZip';
    };


    const [errors, setErrors] = useState<Partial<Record<keyof Application, string>>>({});


    const [currentStep, setCurrentStep] = useState<keyof StepFields>(0);


    const [formData, setFormData] = useState<Partial<Application>>(initialApplication);

    const [loadingApplication, setLoadingApplication] = useState(true);


    const [hasPendingDocuments, setHasPendingDocuments] = useState(true);

    const [refreshKey, setRefreshKey] = useState(0);

    const requiredFields: Record<number, (keyof Application)[]> = {
        0: ['legalName', 'entityType', 'stateInception', 'inceptionDate', 'federalTaxId', 'businessPhone', 'physicalAddress', 'city', 'state', 'zipCode', 'businessEmail', 'existingCashAdvances', 'advanceBalance', 'fundingCompanies', 'taxLiens', 'taxLienPlan', 'bankruptcy', 'homeBased', 'homeOwnership', 'homePayment', 'ownBusinessProperty', 'businessPropertyPayment', 'landlordName', 'industryType'],
        1: ['grossAnnualSales', 'averageMonthlySales', 'lastMonthSales', 'businessBankName', 'creditCardProcessor', 'averageMonthlyCreditCardSales'],
        2: ['firstName', 'lastName', 'dateOfBirth', 'ssn', 'driversLicense', 'officerTitle', 'ownershipPercentage', 'homeAddress', 'ownerCity', 'ownerState', 'ownerZip'],
    };

    const updateDocumentStatus = (newValue: boolean) => {
        setHasPendingDocuments(newValue);
      };

    const fetchApplication = async () => {
        if (!user) return;

        try {
            // Fetch the pending application with the given condition
            const currentApplication = await firebaseService.getRecord(`users/${user.uid}/applications`, slug);

            // Set the application ID or null if not found
            if (currentApplication){
                setFormData(currentApplication);
               setRefreshKey((prevKey) => prevKey + 1);

                setLoadingApplication(false);
             }

        } catch (error) {
            console.error("Error fetching the current application:", error);
        }
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        fetchApplication()
    }, [loading, user, router]);

    if (loading && loadingApplication) return <div>Loading...</div>;

    if (!user) return null;

    const validateField = (name: keyof Application, value: string) => {
        // Helper for digit length validation
        const validateLength = (input: string, requiredLength: number, fieldName: string): string => {
            const sanitizedInput = input.replace(/\D/g, ''); // Remove non-digits
            console.log(sanitizedInput.length, 'input length');
            return sanitizedInput.length !== requiredLength
                ? `${fieldName} must be ${requiredLength} digits`
                : '';
        };

        let error = '';

        switch (name) {
            case 'businessPhone':
                error = validateLength(value, 10, 'Phone number');
                break;
            case 'federalTaxId':
                error = validateLength(value, 9, 'Federal Tax ID');
                break;
            case 'advanceBalance':
            case 'fundingCompanies':
                if (formData.existingCashAdvances === 'yes' && !value) {
                    error = 'This field is required when you have existing cash advances';
                }
                break;
            case 'ssn':
                error = validateSSN(value); // SSN-specific validation logic
                break;
            default:
                if (!value.trim()) { // Trim to avoid issues with whitespace
                    error = 'This field is required';
                }
                break;
        }

        // Debugging log
        console.log(`Field: ${name}, Value: "${value}", Error: "${error}"`);

        // Update the errors state
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    const handleSelectChange = (value: string, name: string) => {
        if (name in formData) {
            const fieldName = name as keyof Application; // Safely cast to keyof Application
            setFormData({ ...formData, [fieldName]: value });
            setErrors((prev) => ({ ...prev, [fieldName]: validateField(fieldName, value) }));
        }
    };

    const handleRadioChange = (value: string, name: string) => {
        if (name in formData) {
            const fieldName = name as keyof Application;
            setFormData({ ...formData, [fieldName]: value });
            setErrors((prev) => ({ ...prev, [fieldName]: validateField(fieldName, value) }));
        } else {
            console.warn(`Field ${name} does not exist in formData`);
        }
    };


    const validateCurrentStep = () => {
        const fieldsToValidate = requiredFields[currentStep];
        const newErrors: { [key: string]: string } = {};
        let isValid = true;

        fieldsToValidate.forEach((field) => {
            const value = formData[field as keyof Application];
            if (field === 'advanceBalance' || field === 'fundingCompanies') {
                if (formData.existingCashAdvances === 'yes' && (!value || value === '')) {
                    isValid = false;
                    newErrors[field] = 'This field is required';
                }
            } else if (!value || value === '') {
                isValid = false;
                newErrors[field] = 'This field is required';
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;

        // Ensure `name` is a valid key of Application
        if (name in formData) {
            // Apply formatting based on the field
            const formattedValue =
                name === 'businessPhone'
                    ? formatPhoneNumber(value)
                    : name === 'federalTaxId'
                        ? formatFederalTaxId(value)
                        : name === 'ssn'
                            ? formatSSN(value)
                            : value;

            // Update form data safely
            setFormData((prev) => ({
                ...prev,
                [name]: formattedValue,
            }));

            // Validate the field
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(name as keyof Application, formattedValue),
            }));
        } else {
            console.warn(`Field "${name}" does not exist in formData`);
        }
    };


    const formatPhoneNumber = (value: string): string => {
        const phoneNumber = value.replace(/\D/g, '').slice(0, 10);
        if (phoneNumber.length > 6) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
        } else if (phoneNumber.length > 3) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        }
        return phoneNumber;
    };

    const formatFederalTaxId = (value: string): string => {
        const taxId = value.replace(/\D/g, '').slice(0, 9);
        if (taxId.length > 2) {
            return `${taxId.slice(0, 2)}-${taxId.slice(2)}`;
        }
        return taxId;
    };

    const formatSSN = (value: string): string => {
        const ssn = value.replace(/\D/g, '').slice(0, 9);
        if (ssn.length > 5) {
            return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5)}`;
        } else if (ssn.length > 3) {
            return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
        }
        return ssn;
    };

    const validateSSN = (ssn: string): string => {
        const cleanSSN = ssn.replace(/\D/g, '');
        if (cleanSSN.length !== 9) {
            return 'SSN must be 9 digits';
        }
        if (/^(\d)\1+$/.test(cleanSSN)) {
            return 'SSN cannot be all the same number';
        }
        if (cleanSSN === '000000000') {
            return 'SSN cannot be all zeros';
        }
        return '';
    };

    const handleStepChange = (direction: 'next' | 'prev') => {
        if (direction === 'next' && validateCurrentStep()) {
            setCurrentStep((prev) => {
                // Make sure we are setting it as keyof StepFields
                const step = Math.min(prev + 1, Object.keys(requiredFields).length - 1) as keyof StepFields;
                console.log(step);
                return step;
            });
        } else if (direction === 'prev') {
            setCurrentStep((prev) => {
                // Make sure we are setting it as keyof StepFields
                return Math.max(prev - 1, 0) as keyof StepFields;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateCurrentStep()) {
            const id = null;
            if (id) {
                router.push('/loan-status');
            } else {
                console.error('Application already exists.');
            }
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <CompanyInformation
                        formData={formData as Pick<Application, StepFields[0]>}
                        handleInputChange={handleInputChange}
                        handleSelectChange={handleSelectChange}
                        handleRadioChange={handleRadioChange}
                        validateField={validateField}
                        errors={errors}
                        isEditing={!isEditing}
                        isNew={false}
                    />
                );
            case 1:
                return (
                    <FinancialInformation
                        formData={formData as Pick<Application, StepFields[1]>}
                        handleInputChange={handleInputChange}
                        errors={errors}
                        isEditing={!isEditing}
                        isNew={false}
                    />
                );
            case 2:
                return (
                    <OwnerInformation
                        formData={formData as Pick<Application, StepFields[2]>}
                        handleInputChange={handleInputChange}
                        errors={errors}
                        isEditing={!isEditing}
                        isNew={false}
                    />
                );
            default:
                return null;
        }
    };

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = async () => {

        try{

        setIsEditing(false)
        console.log(formData);

        const application = {
            ...formData,
            userId: user.uid,
            submissionDate: Timestamp.now(),
            status: 'In Process',
            loanAmount: formData.grossAnnualSales ? parseFloat(formData.grossAnnualSales) * 0.1 : 0,
        };

        if (formData.id){
            
            console.log(application);

            await firebaseService.update(`users/${user.uid}/applications`, formData.id, application);
        }

        toast({
            title: "Changes Saved",
            description: "Your application has been updated.",
        })
    }catch{
        toast({
            title: "Oopss",
            description: `Try Again Later`,
            variant: "destructive",
        })
    }

    }

    const handleConfirm = () => {

        if (hasPendingDocuments) {
            toast({
                title: "Required Documents",
                description: `Upload All required documents`,
                variant: "destructive",
            })
            return;
        }

        setIsConfirmed(true)

        const application = {
            ...formData,
            userId: user.uid,
            submissionDate: Timestamp.now(),
            status: 'Submitted',
            loanAmount: formData.grossAnnualSales ? parseFloat(formData.grossAnnualSales) * 0.1 : 0,
        };

        if (formData.id)
            firebaseService.update(`users/${user.uid}/applications`, formData.id, application);

        toast({
            title: "Application Confirmed",
            description: "Your application has been confirmed and submitted for review.",
        })
    }

    return (
        <div className="min-h-screen bg-gray-100" key={refreshKey}>
            <nav className="bg-white shadow-md">
                {/* Navigation bar code (same as in Dashboard.tsx) */}
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

                <h1 className="text-3xl font-bold mb-6">Review Loan Application</h1>

                <div className="grid gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Summary</CardTitle>
                            <CardDescription>Application ID: {formData.id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderStep()}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {!isEditing && !isConfirmed && (
                                <Button onClick={handleEdit}>
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit Application
                                </Button>
                            )
                            }
                            {isEditing && (
                                <Button onClick={handleSave}>
                                    Save Changes
                                </Button>
                            )}

                            <div className="flex justify-between">
                                {currentStep > 0 && (
                                    <Button onClick={() => handleStepChange('prev')} variant="outline">
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Previous
                                    </Button>
                                )}
                                {currentStep < Object.keys(requiredFields).length - 1 ? (
                                    <Button onClick={() => handleStepChange('next')} className="ml-auto">
                                        Next
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : <></>}
                            </div>


                            {!isConfirmed && (
                                <Button onClick={handleConfirm} disabled={isEditing}>
                                    Confirm Application
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    <RequiredDocuments onUpdate={updateDocumentStatus}></RequiredDocuments>

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