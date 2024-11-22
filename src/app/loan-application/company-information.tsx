import React from 'react'
import { Building } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Application } from '@/types/user'

interface CompanyInformationProps {
    formData: Pick<Application,
        | 'legalName'
        | 'entityType'
        | 'stateInception'
        | 'inceptionDate'
        | 'federalTaxId'
        | 'businessPhone'
        | 'physicalAddress'
        | 'city'
        | 'state'
        | 'zipCode'
        | 'businessEmail'
        | 'existingCashAdvances'
        | 'advanceBalance'
        | 'fundingCompanies'
        | 'taxLiens'
        | 'taxLienPlan'
        | 'bankruptcy'
        | 'homeBased'
        | 'homeOwnership'
        | 'homePayment'
        | 'ownBusinessProperty'
        | 'businessPropertyPayment'
        | 'landlordName'
        | 'industryType'>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: (value: string, name: string) => void;
    handleRadioChange: (value: string, name: string) => void;
    errors: { [key: string]: string };
    validateField: (name: keyof Application, value: string) => void;
}

interface FieldProps {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field: React.FC<FieldProps> = ({ id, label, type = 'text', placeholder, value, error, onChange }) => (
    <div>
        <Label htmlFor={id}>{label}</Label>
        <Input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={`${id}-error`}
        />
        {error && <p id={`${id}-error`} className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

export function CompanyInformation({
    formData,
    handleInputChange,
    handleSelectChange,
    handleRadioChange,
    errors,
    validateField
}: CompanyInformationProps) {
    const handleAdvanceBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(e);
        if (formData.existingCashAdvances === 'yes') {
            validateField('advanceBalance', e.target.value);
        }
    };

    // Utility function to render errors
    const renderError = (fieldName: string) =>
        errors[fieldName] && <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>;

    // Helper to render Radio Groups
    const renderRadioGroup = (
        label: string,
        name: keyof typeof formData,
        options: { value: string; label: string }[]
    ) => (
        <div>
            <Label>{label}</Label>
            <RadioGroup
                defaultValue={formData[name]}
                onValueChange={(value) => handleRadioChange(value, name)}
                className="flex space-x-4"
            >
                {options.map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={`${name}${value}`} />
                        <Label htmlFor={`${name}${value}`}>{label}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );

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
                    <Field
                        id="legalName"
                        label="Legal Name & DBA"
                        placeholder="Legal Name & DBA"
                        value={formData.legalName}
                        error={errors.legalName}
                        onChange={handleInputChange}
                    />
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
                        {renderError('entityType')}
                    </div>
                    <Field
                        id="stateInception"
                        label="State of Inception"
                        placeholder="State of Inception"
                        value={formData.stateInception}
                        error={errors.stateInception}
                        onChange={handleInputChange}
                    />
                    <Field
                        id="inceptionDate"
                        label="Business Inception Date"
                        placeholder="Business Inception Date"
                        type="date"
                        value={formData.inceptionDate}
                        error={errors.inceptionDate}
                        onChange={handleInputChange}
                    />

                    <Field
                        id="federalTaxId"
                        label="Federal Tax ID"
                        placeholder="Federal Tax ID"
                        value={formData.federalTaxId}
                        error={errors.federalTaxId}
                        onChange={handleInputChange}
                    />
                    <Field
                        id="businessPhone"
                        label="Business Phone"
                        placeholder="Business Phone"
                        value={formData.businessPhone}
                        error={errors.businessPhone}
                        onChange={handleInputChange}
                    />
                </div>

                <Field
                    id="physicalAddress"
                    label="Physical Address"
                    placeholder="Physical Address"
                    value={formData.physicalAddress}
                    error={errors.physicalAddress}
                    onChange={handleInputChange}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <Field
                        id="city"
                        label="City"
                        placeholder="City"
                        value={formData.city}
                        error={errors.city}
                        onChange={handleInputChange}
                    />


                    <Field
                        id="state"
                        label="State"
                        placeholder="State"
                        value={formData.state}
                        error={errors.state}
                        onChange={handleInputChange}
                    />


                    <Field
                        id="zipCode"
                        label="Zip Code"
                        placeholder="Zip Code"
                        value={formData.zipCode}
                        error={errors.zipCode}
                        onChange={handleInputChange}
                    />


                </div>

                <Field
                    id="businessEmail"
                    label="Business Email"
                    placeholder="Business Email"
                    value={formData.businessEmail}
                    error={errors.businessEmail}
                    onChange={handleInputChange}
                />

                {/* Dynamic Radio Groups */}
                {renderRadioGroup('Any Existing Cash Advances?', 'existingCashAdvances', [
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                ])}

                {formData.existingCashAdvances === 'yes' && <>
                    <div>
                        <Label htmlFor="advanceBalance">Balance of Current Advances</Label>
                        <Input id="advanceBalance" name="advanceBalance" type="number" placeholder="$0.00" onChange={handleAdvanceBalanceChange} value={formData.advanceBalance} />
                        {errors.advanceBalance && <p className="text-red-500 text-sm mt-1">{errors.advanceBalance}</p>}
                    </div>
                    <div>
                        <Label htmlFor="fundingCompanies">Funding Companies</Label>
                        <Input id="fundingCompanies" name="fundingCompanies" onChange={handleInputChange} value={formData.fundingCompanies} />
                        {errors.fundingCompanies && <p className="text-red-500 text-sm mt-1">{errors.fundingCompanies}</p>}
                    </div>
                </>
                }

                {renderRadioGroup('Business Tax Liens?', 'taxLiens', [
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                ])}


                {renderRadioGroup('Tax Lien Payment Plan?', 'taxLienPlan', [
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                ])}

                {renderRadioGroup('Filed for Bankruptcy Within Last 2 Years?', 'bankruptcy', [
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                ])}


                {renderRadioGroup('Business Home Based?', 'homeBased', [
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                ])}

                {renderRadioGroup('Rent or Own Home?', 'homeOwnership', [
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                ])}

                <Field
                    id="homePayment"
                    label="Home Monthly Payment"
                    placeholder="Home Monthly Payment"
                    value={formData.homePayment}
                    error={errors.homePayment}
                    onChange={handleInputChange}
                />


                {renderRadioGroup('Own Business Property?', 'ownBusinessProperty', [
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                ])}

                <Field
                    id="businessPropertyPayment"
                    label="Business Property Monthly Payment"
                    placeholder="Business Property Monthly Payment"
                    value={formData.businessPropertyPayment}
                    error={errors.businessPropertyPayment}
                    onChange={handleInputChange}
                />

                <Field
                    id="landlordName"
                    label="Landlord Name"
                    placeholder="Landlord Name"
                    value={formData.landlordName}
                    error={errors.landlordName}
                    onChange={handleInputChange}
                />

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
    );
}