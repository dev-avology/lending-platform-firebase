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

export function FinancialInformation({
  formData,
  handleInputChange,
  errors,
}: FinancialInformationProps) {
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
        <Field
          id="grossAnnualSales"
          label="Gross Annual Sales (Last Year's Tax Return)"
          type="number"
          placeholder="$0.00"
          value={formData.grossAnnualSales}
          error={errors.grossAnnualSales}
          onChange={handleInputChange}
        />
        <Field
          id="averageMonthlySales"
          label="Average Monthly Sales"
          type="number"
          placeholder="$0.00"
          value={formData.averageMonthlySales}
          error={errors.averageMonthlySales}
          onChange={handleInputChange}
        />
        <Field
          id="lastMonthSales"
          label="Last Month Total Sales"
          type="number"
          placeholder="$0.00"
          value={formData.lastMonthSales}
          error={errors.lastMonthSales}
          onChange={handleInputChange}
        />
        <Field
          id="businessBankName"
          label="Business Bank Name"
          value={formData.businessBankName}
          error={errors.businessBankName}
          onChange={handleInputChange}
        />
        <Field
          id="creditCardProcessor"
          label="Credit Card Processor"
          value={formData.creditCardProcessor}
          error={errors.creditCardProcessor}
          onChange={handleInputChange}
        />
        <Field
          id="averageMonthlyCreditCardSales"
          label="Average Monthly Credit Card Sales"
          type="number"
          placeholder="$0.00"
          value={formData.averageMonthlyCreditCardSales}
          error={errors.averageMonthlyCreditCardSales}
          onChange={handleInputChange}
        />
      </CardContent>
    </Card>
  );
}
