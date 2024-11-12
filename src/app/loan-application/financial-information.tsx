import React from 'react'
import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FinancialInformationProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

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
                <div>
                    <Label htmlFor="grossAnnualSales">Gross Annual Sales (${`Last Year's Tax Return`})</Label>
                    <Input id="grossAnnualSales" name="grossAnnualSales" type="number" placeholder="$0.00" onChange={handleInputChange} value={formData.grossAnnualSales} />
                    {errors.grossAnnualSales && <p className="text-red-500 text-sm mt-1">{errors.grossAnnualSales}</p>}
                </div>
                <div>
                    <Label htmlFor="averageMonthlySales">Average Monthly Sales</Label>
                    <Input id="averageMonthlySales" name="averageMonthlySales" type="number" placeholder="$0.00" onChange={handleInputChange} value={formData.averageMonthlySales} />
                    {errors.averageMonthlySales && <p className="text-red-500 text-sm mt-1">{errors.averageMonthlySales}</p>}

                </div>
                <div>
                    <Label htmlFor="lastMonthSales">Last Month Total Sales</Label>
                    <Input id="lastMonthSales" name="lastMonthSales" type="number" placeholder="$0.00" onChange={handleInputChange} value={formData.lastMonthSales} />
                    {errors.lastMonthSales && <p className="text-red-500 text-sm mt-1">{errors.lastMonthSales}</p>}

                </div>
                <div>
                    <Label htmlFor="businessBankName">Business Bank Name</Label>
                    <Input id="businessBankName" name="businessBankName" onChange={handleInputChange} value={formData.businessBankName} />
                    {errors.businessBankName && <p className="text-red-500 text-sm mt-1">{errors.businessBankName}</p>}
                </div>
                <div>
                    <Label htmlFor="creditCardProcessor">Credit Card Processor</Label>
                    <Input id="creditCardProcessor" name="creditCardProcessor" onChange={handleInputChange} value={formData.creditCardProcessor} />
                    {errors.creditCardProcessor && <p className="text-red-500 text-sm mt-1">{errors.creditCardProcessor}</p>}

                </div>
                <div>
                    <Label htmlFor="averageMonthlyCreditCardSales">Average Monthly Credit Card Sales</Label>
                    <Input id="averageMonthlyCreditCardSales" name="averageMonthlyCreditCardSales" type="number" placeholder="$0.00" onChange={handleInputChange} value={formData.averageMonthlyCreditCardSales} />
                    {errors.averageMonthlyCreditCardSales && <p className="text-red-500 text-sm mt-1">{errors.averageMonthlyCreditCardSales}</p>}

                </div>
                {/* Add more fields here */}
            </CardContent>
        </Card>
    )
  }