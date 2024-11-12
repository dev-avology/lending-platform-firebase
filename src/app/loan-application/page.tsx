'use client'

import React, { useEffect, useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { saveLoanApplication } from '@/lib/firebase'
import { CompanyInformation } from './company-information'
import { FinancialInformation } from './financial-information'
import { OwnerInformation } from './owner-information'



export default function LoanApplication() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0)
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const requiredFields: { [key: number]: string[] } = {
        0: [
            'legalName',
            'entityType',
            'stateInception',
            'inceptionDate',
            'businessPhone',
            'federalTaxId',
            'physicalAddress',
            'city',
            'state',
            'zipCode',
            'businessEmail',
            'existingCashAdvances',
            'taxLiens',
            'taxLienPlan',
            'bankruptcy',
            'homeBased',
            'homeOwnership',
            'industryType'
        ],
        1: [
            'grossAnnualSales',
            'averageMonthlySales',
            'lastMonthSales',
            'businessBankName',
            'creditCardProcessor',
            'averageMonthlyCreditCardSales'
        ],
        2: [
            'firstName',
            'lastName',
            'dateOfBirth',
            'ssn',
            'driversLicense',
            'officerTitle',
            'ownershipPercentage',
            'homeAddress',
            'ownerCity',
            'ownerState',
            'ownerZip'
        ]
    };

    const [formData, setFormData] = useState({
        legalName: '',
        entityType: '',
        stateInception: '',
        inceptionDate: '',
        businessPhone: '',
        federalTaxId: '',
        physicalAddress: '',
        city: '',
        state: '',
        zipCode: '',
        businessEmail: '',
        existingCashAdvances: 'no',
        advanceBalance: '',
        fundingCompanies: '',
        taxLiens: 'no',
        taxLienPlan: 'no',
        bankruptcy: 'no',
        homeBased: 'no',
        homeOwnership: 'rent',
        homePayment: '',
        ownBusinessProperty: 'no',
        businessPropertyPayment: '',
        landlordName: '',
        industryType: '',
        grossAnnualSales: '',
        averageMonthlySales: '',
        lastMonthSales: '',
        businessBankName: '',
        creditCardProcessor: '',
        averageMonthlyCreditCardSales: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        ssn: '',
        driversLicense: '',
        officerTitle: '',
        ownershipPercentage: '',
        homeAddress: '',
        ownerCity: '',
        ownerState: '',
        ownerZip: ''
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        console.log('Updated formData:', formData);

    }, [formData,user, loading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const steps = ['Company Information', 'Financial Information', 'Owner Information']

    const validateCurrentStep = () => {
        const fieldsToValidate = requiredFields[currentStep];
        const newErrors: { [key: string]: string } = {};
        let isValid = true;

        if (!fieldsToValidate) {
            console.warn(`No fields to validate for step ${currentStep}`);
            return true;
        }

        fieldsToValidate.forEach((field) => {
            const value = formData[field as keyof typeof formData];
            if (!value || value === '') {
                isValid = false;
                newErrors[field] = 'This field is required';
            } else {
                newErrors[field] = '';
            }


        });

        setErrors(newErrors);

        console.log(errors);
        return isValid;
    };

    const handleRadioChange = (value: string, name: string) => {

       // console.log(name, value);

        setFormData({ ...formData, [name]: value });

        //console.log(formData);

        validateField(name, value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        let formattedValue = value;

        if (name === 'businessPhone') {
            formattedValue = formatPhoneNumber(value);
        } else if (name === 'federalTaxId') {
            formattedValue = formatFederalTaxId(value);
        } else if (name === 'ssn') {
            formattedValue = formatSSN(value);
        }

        setFormData({ ...formData, [name]: formattedValue });
        validateField(name, formattedValue);
    };

    const handleSelectChange = (value: string, name: string) => {
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const formatPhoneNumber = (value: string) => {
        const phoneNumber = value.replace(/\D/g, '').slice(0, 10);
        if (phoneNumber.length > 6) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
        } else if (phoneNumber.length > 3) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        }
        return phoneNumber;
    };

    const formatFederalTaxId = (value: string) => {
        const taxId = value.replace(/\D/g, '').slice(0, 9);
        if (taxId.length > 2) {
            return `${taxId.slice(0, 2)}-${taxId.slice(2)}`;
        }
        return taxId;
    };

    const formatSSN = (value: string) => {
        const ssn = value.replace(/\D/g, '').slice(0, 9);
        if (ssn.length > 5) {
            return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5)}`;
        } else if (ssn.length > 3) {
            return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
        }
        return ssn;
    };

    const validateSSN = (ssn: string) => {
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

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'businessPhone':
                if (value.replace(/\D/g, '').length !== 10) {
                    error = 'Phone number must be 10 digits';
                }
                break;
            case 'federalTaxId':
                if (value.replace(/\D/g, '').length !== 9) {
                    error = 'Federal Tax ID must be 9 digits';
                }
                break;
            case 'advanceBalance':
            case 'fundingCompanies':
                if (formData.existingCashAdvances === 'yes' && !value) {
                    error = 'This field is required when you have existing cash advances';
                }
                break;
            case 'ssn':
                error = validateSSN(value);
                break;
            default:
                if (!value) {
                    error = 'This field is required';
                }
                break;
        }
        console.log(name, value, error)
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(validateCurrentStep());
        if (validateCurrentStep()) {
            // Submit form data
            await saveLoanApplication(formData);
            router.push('/loan-status');
            console.log('Form submitted:', formData);
        }
    }

    const nextStep = () => validateCurrentStep() && setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

    const renderStep = () => {

        switch (currentStep) {
            case 0:
                return <CompanyInformation formData={formData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleRadioChange={handleRadioChange} validateField={validateField} errors={errors} />
            case 1:
                return <FinancialInformation formData={formData} handleInputChange={handleInputChange} errors={errors} />
            case 2:
                return <OwnerInformation formData={formData} handleInputChange={handleInputChange} errors={errors} />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md">
                {/* Navigation bar code (same as in Dashboard.tsx) */}
            </nav>

            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Loan Application</h2>

                    <form id="applicationForm" name="applicationForm" className="space-y-8" onSubmit={handleSubmit}>
                        {renderStep()}

                        <div className="mt-8 flex justify-between">
                            {currentStep > 0 && (
                                <Button onClick={prevStep} variant="outline">
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Previous
                                </Button>
                            )}
                            {currentStep < steps.length - 1 ? (
                                <Button onClick={nextStep} className="ml-auto">
                                    Next
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="submit" className="ml-auto">
                                    Submit Application
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

