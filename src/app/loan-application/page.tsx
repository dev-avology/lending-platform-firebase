'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { saveLoanApplication } from '@/lib/firebase';
import { CompanyInformation } from './company-information';
import { FinancialInformation } from './financial-information';
import { OwnerInformation } from './owner-information';
import { Application } from '@/types/user';

export default function LoanApplication() {
    const { user, loading } = useAuth();
    const router = useRouter();

    type StepFields = {
        0: 'legalName' | 'entityType' | 'stateInception' | 'inceptionDate' | 'businessPhone' | 'federalTaxId' | 'physicalAddress' | 'city' | 'state' | 'zipCode' | 'businessEmail' | 'existingCashAdvances' | 'advanceBalance' | 'fundingCompanies' | 'taxLiens' | 'taxLienPlan' | 'bankruptcy' | 'homeBased' | 'homeOwnership' | 'homePayment' | 'ownBusinessProperty' | 'businessPropertyPayment' | 'landlordName' | 'industryType';
        1: 'grossAnnualSales' | 'averageMonthlySales' | 'lastMonthSales' | 'businessBankName' | 'creditCardProcessor' | 'averageMonthlyCreditCardSales';
        2: 'firstName' | 'lastName' | 'dateOfBirth' | 'ssn' | 'driversLicense' | 'officerTitle' | 'ownershipPercentage' | 'homeAddress' | 'ownerCity' | 'ownerState' | 'ownerZip';
    };
    

    const [errors, setErrors] = useState<Partial<Record<keyof Application, string>>>({});


    const [currentStep, setCurrentStep] = useState<keyof StepFields>(0);    


    const [formData, setFormData] = useState<Partial<Application>>({
        // Step 0: Company Information fields
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
        
        // Step 1: Financial Information fields
        grossAnnualSales: '',
        averageMonthlySales: '',
        lastMonthSales: '',
        businessBankName: '',
        creditCardProcessor: '',
        averageMonthlyCreditCardSales: '',
        
        // Step 2: Owner Information fields
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
    



    const requiredFields: Record<number, (keyof Application)[]> = {
        0: ['legalName', 'entityType', 'stateInception', 'inceptionDate', 'federalTaxId', 'businessPhone', 'physicalAddress', 'city', 'state', 'zipCode', 'businessEmail', 'existingCashAdvances', 'advanceBalance', 'fundingCompanies', 'taxLiens', 'taxLienPlan', 'bankruptcy', 'homeBased', 'homeOwnership', 'homePayment', 'ownBusinessProperty', 'businessPropertyPayment', 'landlordName', 'industryType'],
        1: ['grossAnnualSales', 'averageMonthlySales', 'lastMonthSales', 'businessBankName', 'creditCardProcessor', 'averageMonthlyCreditCardSales'],
        2: ['firstName', 'lastName', 'dateOfBirth', 'ssn', 'driversLicense', 'officerTitle', 'ownershipPercentage', 'homeAddress', 'ownerCity', 'ownerState', 'ownerZip'],
    };



    

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    if (loading) return <div>Loading...</div>;

    if (!user) return null;

    const validateField = (name: keyof Application, value: string) => {
        // Helper for digit length validation
        const validateLength = (input: string, requiredLength: number, fieldName: string): string => {
            const sanitizedInput = input.replace(/\D/g, ''); // Remove non-digits
            console.log(sanitizedInput.length,'input length');
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
            if(field === 'advanceBalance' || field === 'fundingCompanies'){
              if(formData.existingCashAdvances === 'yes' && (!value || value === '')){
                isValid = false;
                newErrors[field] = 'This field is required';
              }
            }else if (!value || value === '') {
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
            const id = await saveLoanApplication(formData);
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
                        handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleRadioChange={handleRadioChange} validateField={validateField} errors={errors} isEditing={false} isNew={true}
                    />
                );
            case 1:
                return (
                    <FinancialInformation
                        formData={formData as Pick<Application, StepFields[1]>}
                        handleInputChange={handleInputChange}
                        errors={errors} isEditing={false} isNew={true}
                    />
                );
            case 2:
                return (
                    <OwnerInformation
                        formData={formData as Pick<Application, StepFields[2]>}
                        handleInputChange={handleInputChange}
                        errors={errors} isEditing={false} isNew={true}
                    />
                );
            default:
                return null;
        }
    };
    

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Loan Application</h2>
                <form onSubmit={handleSubmit}>
                    {renderStep()}
                    <div className="mt-8 flex justify-between">
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
                        ) : (
                            <Button type="submit" className="ml-auto">
                                Submit Application
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </form>
            </main>
        </div>
    );
}
