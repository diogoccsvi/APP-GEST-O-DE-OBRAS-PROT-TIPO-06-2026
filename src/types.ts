export type ProjectCategory = 'RESIDENTIAL' | 'COMMERCE' | 'MIXED';

export interface ProjectDetails {
  id?: string; // unique identifier
  name: string;
  totalArea: number; // in m²
  apartmentsCount: number;
  garagesCount: number;
  commonAreasDescription: string;
  address: string;
  plannedBudget: number;
  spentBudget: number;
  startDate: string;
  expectedEndDate: string;
  coordinator?: string; // Eng. responsável
  crea?: string; // registro profissional
  accessPassword?: string; // Senha de acesso ao projeto
}

export type UserRole = 'MASTER' | 'COMPRAS' | 'FINANCEIRO' | 'INVESTIDOR';

export interface AppUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  password: string;
  crea?: string;
}

export type StageId = 'INFRA' | 'ESTRU' | 'ALVEN' | 'INSTA' | 'ACABA' | 'COMUM';

export interface ConstructionStage {
  id: StageId;
  name: string;
  weight: number; // Percentage contribution of this stage (e.g., 20 means 20%)
  plannedCost: number;
  spentCost: number;
  progress: number; // 0 to 100
  startDate: string;
  endDate: string;
  color: string; // Tailwind-like color coding or hex
}

export interface ScheduleTask {
  id: string;
  stageId: StageId;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  progress: number; // 0 to 100
  responsible: string;
}

export type CostCategory = 'MATERIAL' | 'LABOR' | 'EQUIPMENT' | 'ADMIN' | 'OTHER';

export interface Expense {
  id: string;
  stageId: StageId;
  title: string;
  category: CostCategory;
  value: number;
  date: string;
  provider: string;
  status: 'ESTIMATED' | 'PAID' | 'PENDING';
}

export interface Measurement {
  id: string;
  stageId: StageId;
  date: string;
  measuredPercentage: number; // increment, e.g. 15 for +15%
  valueAmount: number; // monetary amount for this segment
  responsible: string; // engineer
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes: string;
}

export interface PhotoReport {
  id: string;
  stageId: StageId;
  title: string;
  description: string;
  imageUrl: string; // URL or base64 data
  timestamp: string;
  uploadedBy: string;
  locationTag: string; // e.g., "Apto 302", "Garagem G1", "Fachada Lateral"
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  contact: string;
  email: string;
  phone: string;
  serviceType: string; // e.g., "Mão de Obra de Alvenaria", "Fornecedor de Concreto"
  rating: number; // 1-5 stars
}

export interface Contract {
  id: string;
  supplierId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'DRAFT';
}

export interface TeamMember {
  id: string;
  projectId: string; // associate to specific work
  name: string;
  role: string; // e.g., "Engenheiro de Campo", "Mestre de Obras", "Fiscal", "Arquiteto"
  email: string;
  phone: string;
}

export interface RealEstateTax {
  id: string;
  name: string; // e.g., "RET (Regime Especial de Tributação)", "INCC-M", "ISS", "FGTS e CPRB"
  description: string;
  rate: number; // percentage (e.g. 4 for 4%)
  basis: string; // e.g., "Calculado sobre Valor do Empreendimento" or "Calculado sobre Folha de Pagamento"
  type: 'FEDERAL' | 'MUNICIPAL' | 'LABOR' | 'INDEX';
}
