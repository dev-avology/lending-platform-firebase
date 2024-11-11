'use client'

import React, { useEffect, useState } from 'react'
import { Building, DollarSign, User, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

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
    }, [user, loading, router]);

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
        return isValid;
    };

    const handleRadioChange = (value: string, name: string) => {
        setFormData({ ...formData, [name]: value });
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
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateCurrentStep()) {
            // Submit form data
            console.log('Form submitted:', formData);
        }
    }

    const nextStep = () => validateCurrentStep() && setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <CompanyInformation formData={formData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleRadioChange={handleRadioChange} errors={errors} />
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

function CompanyInformation({ formData, handleInputChange, handleSelectChange, handleRadioChange, errors }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Building className="inline-block w-6 h-6 mr-2" />
                    Company Information
                </CardTitle>
                <CardDescription>Provide details about your business</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="legalName">Legal Name & DBA</Label>
                        <Input id="legalName" name="legalName" onChange={handleInputChange} value={formData.legalName} />
                        {/* {errors.legalName && <p className="text-red-500 text-sm mt-1">{errors.legalName}</p>} */}
                    </div>
                    <div>
                        <Label htmlFor="entityType">Legal Entity Type</Label>
                        <Select name="entityType" onValueChange={(value) => handleSelectChange(value, 'entityType')} value={formData.entityType}>
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
                        {/* {errors.entityType && <p className="text-red-500 text-sm mt-1">{errors.entityType}</p>} */}
                    </div>
                    <div>
                        <Label htmlFor="stateInception">State of Inception</Label>
                        <Input id="stateInception" name="stateInception" onChange={handleInputChange} value={formData.stateInception} />
                        {/* {errors.stateInception && <p className="text-red-500 text-sm mt-1">{errors.stateInception}</p>} */}
                    </div>
                    <div>
                        <Label htmlFor="inceptionDate">Business Inception Date</Label>
                        <Input id="inceptionDate" type="date" name="inceptionDate" onChange={handleInputChange} value={formData.inceptionDate} />
                    </div>
                    <div>
                        <Label htmlFor="federalTaxId">Federal Tax ID</Label>
                        <Input id="federalTaxId" name="federalTaxId" onChange={handleInputChange} value={formData.federalTaxId} />
                    </div>
                    <div>
                        <Label htmlFor="businessPhone">Business Phone</Label>
                        <Input id="businessPhone" type="tel" name="businessPhone" onChange={handleInputChange} value={formData.businessPhone} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="physicalAddress">Physical Address</Label>
                    <Input id="physicalAddress" name="physicalAddress" onChange={handleInputChange} value={formData.physicalAddress} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" onChange={handleInputChange} value={formData.city} />
                    </div>
                    <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" onChange={handleInputChange} value={formData.state} />
                    </div>
                    <div>
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input id="zipCode" name="zipCode" onChange={handleInputChange} value={formData.zipCode} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="businessEmail">Business Email</Label>
                    <Input id="businessEmail" type="email" name="businessEmail" onChange={handleInputChange} value={formData.businessEmail} />
                </div>
                <div>
                    <Label>Any Existing Cash Advances?</Label>
                    <RadioGroup defaultValue={formData.existingCashAdvances} onValueChange={(value) => handleRadioChange(value, 'existingCashAdvances')} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="cashAdvancesYes" />
                            <Label htmlFor="cashAdvancesYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="cashAdvancesNo" />
                            <Label htmlFor="cashAdvancesNo">No</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div>
                    <Label htmlFor="advanceBalance">Balance of Current Advances</Label>
                    <Input id="advanceBalance" name="advanceBalance" type="number" placeholder="$0.00" onChange={handleInputChange} value={formData.advanceBalance} />
                </div>
                <div>
                    <Label htmlFor="fundingCompanies">Funding Companies</Label>
                    <Input id="fundingCompanies" name="fundingCompanies" onChange={handleInputChange} value={formData.fundingCompanies} />
                </div>
                <div>
                    <Label>Business Tax Liens?</Label>
                    <RadioGroup defaultValue={formData.taxLiens} onValueChange={(value) => handleRadioChange(value, 'taxLiens')} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="taxLiensYes" />
                            <Label htmlFor="taxLiensYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="taxLiensNo" />
                            <Label htmlFor="taxLiensNo">No</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div>
                    <Label>Tax Lien Payment Plan?</Label>
                    <RadioGroup defaultValue={formData.taxLienPlan} onValueChange={(value) => handleRadioChange(value, 'taxLienPlan')} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="taxLienPlanYes" />
                            <Label htmlFor="taxLienPlanYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="taxLienPlanNo" />
                            <Label htmlFor="taxLienPlanNo">No</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div>
                    <Label>Filed for Bankruptcy Within Last 2 Years?</Label>
                    <RadioGroup defaultValue={formData.bankruptcy} onValueChange={(value) => handleRadioChange(value, 'bankruptcy')} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="bankruptcyYes" />
                            <Label htmlFor="bankruptcyYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="bankruptcyNo" />
                            <Label htmlFor="bankruptcyNo">No</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div>
                    <Label>Business Home Based?</Label>
                    <RadioGroup defaultValue={formData.homeBased} onValueChange={(value) => handleRadioChange(value, 'homeBased')} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="homeBasedYes" />
                            <Label htmlFor="homeBasedYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="homeBasedNo" />
                            <Label htmlFor="homeBasedNo">No</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div>
                    <Label>Rent or Own Home?</Label>
                    <RadioGroup defaultValue={formData.homeOwnership} onValueChange={(value) => handleRadioChange(value, 'homeOwnership')} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rent" id="rentHome" />
                            <Label htmlFor="rentHome">Rent</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="own" id="ownHome" />
                            <Label htmlFor="ownHome">Own</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div>
                    <Label htmlFor="homePayment">Home Monthly Payment</Label>
                    <Input id="homePayment" name="homePayment" type="number" placeholder="$0.00" onChange={handleInputChange} value={formData.homePayment} />
                </div>
                <div>
                    <Label>Own Business Property?</Label>
                    <RadioGroup defaultValue={formData.ownBusinessProperty} onValueChange={(value) => handleRadioChange(value, 'ownBusinessProperty')} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="ownBusinessPropertyYes" />
                            <Label htmlFor="ownBusinessPropertyYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="ownBusinessPropertyNo" />
                            <Label htmlFor="ownBusinessPropertyNo">No</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div>
                    <Label htmlFor="businessPropertyPayment">Business Property Monthly Payment</Label>
                    <Input id="businessPropertyPayment" name="businessPropertyPayment" type="number" placeholder="$0.00" onChange={handleInputChange} value={formData.businessPropertyPayment} />
                </div>
                <div>
                    <Label htmlFor="landlordName">Landlord Name</Label>
                    <Input id="landlordName" name="landlordName" onChange={handleInputChange} value={formData.landlordName} />
                </div>
                <div>
                    <Label htmlFor="industryType">Industry Type</Label>
                    <Select name="industryType" onValueChange={(value) => handleSelectChange(value, 'industryType')} value={formData.industryType}>
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
                {/* Add more fields here */}
            </CardContent>
        </Card>
    )
}

function FinancialInformation({ formData, handleInputChange, errors }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <DollarSign className="inline-block w-6 h-6 mr-2" />
                    Business Financial Information
                </CardTitle>
                <CardDescription>Provide financial details about your business</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div>
                    <Label htmlFor="grossAnnualSales">Gross Annual Sales (${`Last Year's Tax Return`})</Label>
                    <Input id="grossAnnualSales" name="grossAnnualSales" type="number" placeholder="$0.00" onChange={handleInputChange} value={formData.grossAnnualSales} />
                    {/* {errors.grossAnnualSales && <p className="text-red-500 text-sm mt-1">{errors.grossAnnualSales}</p>} */}
                </div>
                <div>
                    <Label htmlFor="averageMonthlySales">Average Monthly Sales</Label>
                    <Input id="averageMonthlySales" name="averageMonthlySales" type="number" placeholder="$0.00" onChange={handleInputChange} value={formData.averageMonthlySales} />
                </div>
                <div>
                    <Label htmlFor="lastMonthSales">Last Month Total Sales</Label>
                    <Input id="lastMonthSales" name="lastMonthSales" type="number" placeholder="$0.00" onChange={handleInputChange} value={formData.lastMonthSales} />
                </div>
                <div>
                    <Label htmlFor="businessBankName">Business Bank Name</Label>
                    <Input id="businessBankName" name="businessBankName" onChange={handleInputChange} value={formData.businessBankName} />
                </div>
                <div>
                    <Label htmlFor="creditCardProcessor">Credit Card Processor</Label>
                    <Input id="creditCardProcessor" name="creditCardProcessor" onChange={handleInputChange} value={formData.creditCardProcessor} />
                </div>
                <div>
                    <Label htmlFor="averageMonthlyCreditCardSales">Average Monthly Credit Card Sales</Label>
                    <Input id="averageMonthlyCreditCardSales" name="averageMonthlyCreditCardSales" type="number" placeholder="$0.00" onChange={handleInputChange} value={formData.averageMonthlyCreditCardSales} />
                </div>
                {/* Add more fields here */}
            </CardContent>
        </Card>
    )
}

function OwnerInformation({ formData, handleInputChange, errors }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <User className="inline-block w-6 h-6 mr-2" />
                    Owner Information
                </CardTitle>
                <CardDescription>Provide details about the business owner</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" onChange={handleInputChange} value={formData.firstName} />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" onChange={handleInputChange} value={formData.lastName} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" name="dateOfBirth" onChange={handleInputChange} value={formData.dateOfBirth} />
                </div>
                <div>
                    <Label htmlFor="ssn">Social Security Number</Label>
                    <Input id="ssn" name="ssn" onChange={handleInputChange} value={formData.ssn} />
                </div>
                <div>
                    <Label htmlFor="driversLicense">Drivers License Number</Label>
                    <Input id="driversLicense" name="driversLicense" onChange={handleInputChange} value={formData.driversLicense} />
                </div>
                <div>
                    <Label htmlFor="officerTitle">Officer Title</Label>
                    <Input id="officerTitle" name="officerTitle" onChange={handleInputChange} value={formData.officerTitle} />
                </div>
                <div>
                    <Label htmlFor="ownershipPercentage">Business Ownership Percentage (%)</Label>
                    <Input id="ownershipPercentage" type="number" min="0" max="100" name="ownershipPercentage" onChange={handleInputChange} value={formData.ownershipPercentage} />
                </div>
                <div>
                    <Label htmlFor="homeAddress">Home Address</Label>
                    <Input id="homeAddress" name="homeAddress" onChange={handleInputChange} value={formData.homeAddress}/>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <Label htmlFor="ownerCity">City</Label>
                        <Input id="ownerCity" name="ownerCity" onChange={handleInputChange} value={formData.ownerCity} />
                    </div>
                    <div>
                        <Label htmlFor="ownerState">State</Label>
                        <Input id="ownerState" name="ownerState" onChange={handleInputChange} value={formData.ownerState} />
                    </div>
                    <div>
                        <Label htmlFor="ownerZip">Zip</Label>
                        <Input id="ownerZip" name="ownerZip" onChange={handleInputChange} value={formData.ownerZip} />
                    </div>
                </div>
                {/* Add more fields here */}
            </CardContent>
        </Card>
    )
}