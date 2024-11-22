import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Application } from '@/types/user';

interface OwnerInformationProps {
  formData: Pick<
    Application,
    | 'firstName'
    | 'lastName'
    | 'dateOfBirth'
    | 'ssn'
    | 'driversLicense'
    | 'officerTitle'
    | 'ownershipPercentage'
    | 'homeAddress'
    | 'ownerCity'
    | 'ownerState'
    | 'ownerZip'
  >;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field: React.FC<FieldProps> = ({ id, label, type = 'text', value, error, onChange }) => (
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
    />
    {error && <p id={`${id}-error`} className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

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
          <Field id="firstName" label="First Name" value={formData.firstName} error={errors.firstName} onChange={handleInputChange} />
          <Field id="lastName" label="Last Name" value={formData.lastName} error={errors.lastName} onChange={handleInputChange} />
        </div>
        <Field id="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} error={errors.dateOfBirth} onChange={handleInputChange} />
        <Field id="ssn" label="Social Security Number" value={formData.ssn} error={errors.ssn} onChange={handleInputChange} />
        <Field id="driversLicense" label="Driver's License Number" value={formData.driversLicense} error={errors.driversLicense} onChange={handleInputChange} />
        <Field id="officerTitle" label="Officer Title" value={formData.officerTitle} error={errors.officerTitle} onChange={handleInputChange} />
        <Field id="ownershipPercentage" label="Business Ownership Percentage (%)" type="number" value={formData.ownershipPercentage} error={errors.ownershipPercentage} onChange={handleInputChange} />
        <Field id="homeAddress" label="Home Address" value={formData.homeAddress} error={errors.homeAddress} onChange={handleInputChange} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field id="ownerCity" label="City" value={formData.ownerCity} error={errors.ownerCity} onChange={handleInputChange} />
          <Field id="ownerState" label="State" value={formData.ownerState} error={errors.ownerState} onChange={handleInputChange} />
          <Field id="ownerZip" label="Zip Code" value={formData.ownerZip} error={errors.ownerZip} onChange={handleInputChange} />
        </div>
      </CardContent>
    </Card>
  );
}
