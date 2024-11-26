
import { Timestamp } from 'firebase/firestore';

export interface UserData {
    uid: string
    firstName:string
    lastName:string
    email:string
    phoneNumber:string
    username:string
    dateOfBirth:string
    ssn:string
    businessName:string
    businessAddress:string
    industry:string
    photoURL?:string
    bio?: string
    registrationComplete:boolean
    createdAt: Timestamp | null
  }


export interface Document {
    name: string;
    status: 'pending' | 'uploaded';
  }

export interface Application {
    status: string
    loanAmount: string
    submissionDate: Timestamp
    id?: string,
    legalName: string,
    entityType: string,
    stateInception: string,
    inceptionDate: string,
    businessPhone: string,
    federalTaxId: string,
    physicalAddress: string,
    city: string,
    state: string,
    zipCode: string,
    businessEmail: string,
    existingCashAdvances: 'no' | 'yes',
    advanceBalance: string,
    fundingCompanies: string,
    taxLiens: 'no' | 'yes',
    taxLienPlan: 'no' | 'yes',
    bankruptcy: 'no' | 'yes',
    homeBased: 'no' | 'yes',
    homeOwnership: 'rent' | 'own',
    homePayment: string,
    ownBusinessProperty: 'no' | 'yes',
    businessPropertyPayment: string,
    landlordName: string,
    industryType: string,
    grossAnnualSales: string,
    averageMonthlySales: string,
    lastMonthSales: string,
    businessBankName: string,
    creditCardProcessor: string,
    averageMonthlyCreditCardSales: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    ssn: string,
    driversLicense: string,
    officerTitle: string,
    ownershipPercentage: string,
    homeAddress: string,
    ownerCity: string,
    ownerState: string,
    ownerZip: string
}

export interface Offer {
  lender: string,
  amount: string,
  rate: string,
  term: string,
  prepaymentPenalty: string,
  payment: string,
  paymentFrequency: string,
  status: string,
  stips: Document[]
}


