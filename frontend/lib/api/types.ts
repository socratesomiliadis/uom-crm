export interface CompanyDto {
  id: number;
  name: string;
  industry?: string | null;
  website?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  createdAt: string; // ISO timestamp string
  updatedAt: string; // ISO timestamp string
}

export interface CompanyCreateDto
  extends Omit<CompanyDto, "id" | "createdAt" | "updatedAt"> {}

export interface ContactDto {
  id: number;
  companyId?: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  jobTitle?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactCreateDto
  extends Omit<ContactDto, "id" | "createdAt" | "updatedAt"> {}

export interface OpportunityDto {
  id: number;
  contactId: number;
  title: string;
  amount: string; // BigDecimal -> serialized as string
  stage: "NEW" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST";
  closeDate?: string | null; // e.g. "2025-09-30"
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityCreateDto
  extends Omit<OpportunityDto, "id" | "createdAt" | "updatedAt"> {}

export interface ActivityDto {
  id: number;
  contactId?: number | null;
  type: "CALL" | "EMAIL" | "MEETING" | "NOTE" | "TASK";
  subject?: string | null;
  description?: string | null;
  activityDate: string;
  dueDate?: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityCreateDto
  extends Omit<ActivityDto, "id" | "createdAt" | "updatedAt"> {}

export interface AuthResponse {
  token: string;
}
