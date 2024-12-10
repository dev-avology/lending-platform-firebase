import React from 'react';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Application } from '@/types/user';

interface FinancialInformationProps {
  formData: Pick<
    Application,
    | 'grossAnnualSales'
    | 'averageMonthlySales'
    | 'lastMonthSales'
    | 'businessBankName'
    | 'creditCardProcessor'
    | 'averageMonthlyCreditCardSales'
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
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly:boolean;
}

const Field: React.FC<FieldProps> = ({ id, label, type = 'text', placeholder, value, error, onChange, readonly = false }) => (
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
      readOnly={readonly}
    />
    {error && <p id={`${id}-error`} className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export function FinancialInformation({
  formData,
  handleInputChange,
  errors,
  isEditing=false,
  isNew =false,
}: FinancialInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <DollarSign className="inline-block w-6 h-6 mr-2" />
          Business Financial Information
        </CardTitle>
        <CardDescription>{(isNew)?`Provide financial details about your business`:`Financial details about your business`}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Field
          id="grossAnnualSales"
          label="Gross Annual Sales (Last Year's Tax Return)"
          type="number"
          placeholder="$0.00"
          value={formData.grossAnnualSales}
          error={errors.grossAnnualSales}
          onChange={handleInputChange}
          readonly={isEditing}
        />
        <Field
          id="averageMonthlySales"
          label="Average Monthly Sales"
          type="number"
          placeholder="$0.00"
          value={formData.averageMonthlySales}
          error={errors.averageMonthlySales}
          onChange={handleInputChange}
          readonly={isEditing}
        />
        <Field
          id="lastMonthSales"
          label="Last Month Total Sales"
          type="number"
          placeholder="$0.00"
          value={formData.lastMonthSales}
          error={errors.lastMonthSales}
          onChange={handleInputChange}
          readonly={isEditing}
        />
        <Field
          id="businessBankName"
          label="Business Bank Name"
          value={formData.businessBankName}
          error={errors.businessBankName}
          onChange={handleInputChange}
          readonly={isEditing}
        />
        <Field
          id="creditCardProcessor"
          label="Credit Card Processor"
          value={formData.creditCardProcessor}
          error={errors.creditCardProcessor}
          onChange={handleInputChange}
          readonly={isEditing}
        />
        <Field
          id="averageMonthlyCreditCardSales"
          label="Average Monthly Credit Card Sales"
          type="number"
          placeholder="$0.00"
          value={formData.averageMonthlyCreditCardSales}
          error={errors.averageMonthlyCreditCardSales}
          onChange={handleInputChange}
          readonly={isEditing}
        />
      </CardContent>
    </Card>
  );
}
