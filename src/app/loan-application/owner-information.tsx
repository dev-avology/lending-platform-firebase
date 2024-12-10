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
  isEditing:boolean;
  isNew :boolean;
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly:boolean;
}

const Field: React.FC<FieldProps> = ({ id, label, type = 'text', value, error, onChange, readonly = false  }) => (
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
      readOnly={readonly}
    />
    {error && <p id={`${id}-error`} className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export function OwnerInformation({
  formData,
  handleInputChange,
  errors,
  isEditing = false,
  isNew  = false,
}: OwnerInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <User className="inline-block w-6 h-6 mr-2" />
          Owner Information
        </CardTitle>
        <CardDescription>{(isNew )?`Provide details about the business owner`:`Details about the business owner`}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="firstName" label="First Name" value={formData.firstName} error={errors.firstName} onChange={handleInputChange} readonly={isEditing}/>
          <Field id="lastName" label="Last Name" value={formData.lastName} error={errors.lastName} onChange={handleInputChange} readonly={isEditing}/>
        </div>
        <Field id="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} error={errors.dateOfBirth} onChange={handleInputChange} readonly={isEditing}/>
        <Field id="ssn" label="Social Security Number" value={formData.ssn} error={errors.ssn} onChange={handleInputChange} readonly={isEditing}/>
        <Field id="driversLicense" label="Driver's License Number" value={formData.driversLicense} error={errors.driversLicense} onChange={handleInputChange} readonly={isEditing}/>
        <Field id="officerTitle" label="Officer Title" value={formData.officerTitle} error={errors.officerTitle} onChange={handleInputChange} readonly={isEditing}/>
        <Field id="ownershipPercentage" label="Business Ownership Percentage (%)" type="number" value={formData.ownershipPercentage} error={errors.ownershipPercentage} onChange={handleInputChange} readonly={isEditing}/>
        <Field id="homeAddress" label="Home Address" value={formData.homeAddress} error={errors.homeAddress} onChange={handleInputChange} readonly={isEditing}/>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field id="ownerCity" label="City" value={formData.ownerCity} error={errors.ownerCity} onChange={handleInputChange} readonly={isEditing}/>
          <Field id="ownerState" label="State" value={formData.ownerState} error={errors.ownerState} onChange={handleInputChange} readonly={isEditing}/>
          <Field id="ownerZip" label="Zip Code" value={formData.ownerZip} error={errors.ownerZip} onChange={handleInputChange} readonly={isEditing}/>
        </div>
      </CardContent>
    </Card>
  );
}
