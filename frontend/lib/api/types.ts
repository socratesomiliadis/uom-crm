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

export interface ActivityDto {
  id: number;
  contactId?: number | null;
  userId?: number | null;
  type: "CALL" | "EMAIL" | "MEETING" | "NOTE" | "TASK";
  subject?: string | null;
  description?: string | null;
  activityDate: string;
  dueDate?: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
}
