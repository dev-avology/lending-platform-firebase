import React from 'react'
import { User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OwnerInformationProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

export function OwnerInformation({ 
    formData, 
    handleInputChange, 
    errors,
  }: OwnerInformationProps) {
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
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" onChange={handleInputChange} value={formData.lastName} />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                </div>
                <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" name="dateOfBirth" onChange={handleInputChange} value={formData.dateOfBirth} />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>
                <div>
                    <Label htmlFor="ssn">Social Security Number</Label>
                    <Input id="ssn" name="ssn" onChange={handleInputChange} value={formData.ssn} />
                    {errors.ssn && <p className="text-red-500 text-sm mt-1">{errors.ssn}</p>}
                </div>
                <div>
                    <Label htmlFor="driversLicense">Drivers License Number</Label>
                    <Input id="driversLicense" name="driversLicense" onChange={handleInputChange} value={formData.driversLicense} />
                    {errors.driversLicense && <p className="text-red-500 text-sm mt-1">{errors.driversLicense}</p>}
                </div>
                <div>
                    <Label htmlFor="officerTitle">Officer Title</Label>
                    <Input id="officerTitle" name="officerTitle" onChange={handleInputChange} value={formData.officerTitle} />
                    {errors.officerTitle && <p className="text-red-500 text-sm mt-1">{errors.officerTitle}</p>}
                </div>
                <div>
                    <Label htmlFor="ownershipPercentage">Business Ownership Percentage (%)</Label>
                    <Input id="ownershipPercentage" type="number" min="0" max="100" name="ownershipPercentage" onChange={handleInputChange} value={formData.ownershipPercentage} />
                    {errors.ownershipPercentage && <p className="text-red-500 text-sm mt-1">{errors.ownershipPercentage}</p>}
                </div>
                <div>
                    <Label htmlFor="homeAddress">Home Address</Label>
                    <Input id="homeAddress" name="homeAddress" onChange={handleInputChange} value={formData.homeAddress} />
                    {errors.homeAddress && <p className="text-red-500 text-sm mt-1">{errors.homeAddress}</p>}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <Label htmlFor="ownerCity">City</Label>
                        <Input id="ownerCity" name="ownerCity" onChange={handleInputChange} value={formData.ownerCity} />
                        {errors.ownerCity && <p className="text-red-500 text-sm mt-1">{errors.ownerCity}</p>}
                    </div>
                    <div>
                        <Label htmlFor="ownerState">State</Label>
                        <Input id="ownerState" name="ownerState" onChange={handleInputChange} value={formData.ownerState} />
                        {errors.ownerState && <p className="text-red-500 text-sm mt-1">{errors.ownerState}</p>}
                    </div>
                    <div>
                        <Label htmlFor="ownerZip">Zip</Label>
                        <Input id="ownerZip" name="ownerZip" onChange={handleInputChange} value={formData.ownerZip} />
                        {errors.ownerZip && <p className="text-red-500 text-sm mt-1">{errors.ownerZip}</p>}
                    </div>
                </div>
                {/* Add more fields here */}
            </CardContent>
        </Card>
    )
  }