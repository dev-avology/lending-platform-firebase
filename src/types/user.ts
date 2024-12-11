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

export type DocumentStatus = 'pending' | 'uploading' | 'submitted' | 'uploaded' | 'not_required' | 'error'

export interface Document {
    name: string;
    status: DocumentStatus;
    progress?: number;
    downloadUrl?: string;
  }

export const initialDocuments: Document[] = [
  { name: 'Banking Statements ', status: 'pending' },
  { name: 'Tax Returns', status: 'pending' },
  { name: 'Profit & Loss Statement', status: 'pending' },
  { name: 'Balance Sheet', status: 'pending' },
  ]


export interface Application {
    id?: string,
    status: string,
    loanAmount: string,
    submissionDate: Timestamp
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

export const initialApplication: Application = {
  id: '',
  status: '',
  loanAmount: '',
  submissionDate: Timestamp.now(),
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
};


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

export interface ConnectedBanks {
  id: string;
  persistent_id: string;
  name: string;
  bank_name: string;
  mask: string;
  access_token: string;
  item_id: string;
  status: boolean;
}


