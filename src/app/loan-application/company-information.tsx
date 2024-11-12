import React from 'react'
import { Building } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CompanyInformationProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
  handleRadioChange: (value: string, name: string) => void;
  errors: { [key: string]: string };
  validateField: (name: string, value: string) => void;
}

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
                {errors.legalName && <p className="text-red-500 text-sm mt-1">{errors.legalName}</p>}
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
                {errors.entityType && <p className="text-red-500 text-sm mt-1">{errors.entityType}</p>}
            </div>
            <div>
                <Label htmlFor="stateInception">State of Inception</Label>
                <Input id="stateInception" name="stateInception" onChange={handleInputChange} value={formData.stateInception} />
                {errors.stateInception && <p className="text-red-500 text-sm mt-1">{errors.stateInception}</p>}
            </div>
            <div>
                <Label htmlFor="inceptionDate">Business Inception Date</Label>
                <Input id="inceptionDate" type="date" name="inceptionDate" onChange={handleInputChange} value={formData.inceptionDate} />
                {errors.inceptionDate && <p className="text-red-500 text-sm mt-1">{errors.inceptionDate}</p>}
            </div>
            <div>
                <Label htmlFor="federalTaxId">Federal Tax ID</Label>
                <Input id="federalTaxId" name="federalTaxId" onChange={handleInputChange} value={formData.federalTaxId} />
                {errors.federalTaxId && <p className="text-red-500 text-sm mt-1">{errors.federalTaxId}</p>}
            </div>
            <div>
                <Label htmlFor="businessPhone">Business Phone</Label>
                <Input id="businessPhone" type="tel" name="businessPhone" onChange={handleInputChange} value={formData.businessPhone} />
                {errors.businessPhone && <p className="text-red-500 text-sm mt-1">{errors.businessPhone}</p>}
            </div>
        </div>
        <div>
            <Label htmlFor="physicalAddress">Physical Address</Label>
            <Input id="physicalAddress" name="physicalAddress" onChange={handleInputChange} value={formData.physicalAddress} />
            {errors.physicalAddress && <p className="text-red-500 text-sm mt-1">{errors.physicalAddress}</p>}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" onChange={handleInputChange} value={formData.city} />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" onChange={handleInputChange} value={formData.state} />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
            <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input id="zipCode" name="zipCode" onChange={handleInputChange} value={formData.zipCode} />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
            </div>
        </div>
        <div>
            <Label htmlFor="businessEmail">Business Email</Label>
            <Input id="businessEmail" type="email" name="businessEmail" onChange={handleInputChange} value={formData.businessEmail} />
            {errors.businessEmail && <p className="text-red-500 text-sm mt-1">{errors.businessEmail}</p>}
        </div>
        <div>
            <Label>Any Existing Cash Advances?</Label>
            <RadioGroup defaultValue={formData.existingCashAdvances} onValueChange={(value) => {
                handleRadioChange(value, 'existingCashAdvances');
                if (value === 'no') {
                    handleInputChange({ target: { name: 'advanceBalance', value: '' } } as React.ChangeEvent<HTMLInputElement>);
                    handleInputChange({ target: { name: 'fundingCompanies', value: '' } } as React.ChangeEvent<HTMLInputElement>);
                    handleInputChange({ target: { name: 'existingCashAdvances', value: 'no' } } as React.ChangeEvent<HTMLInputElement>);
                }
            }} className="flex space-x-4">
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
  );
}