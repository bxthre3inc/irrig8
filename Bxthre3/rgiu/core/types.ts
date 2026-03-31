// RGIU Core Types - Zero dependency contracts

export interface Context {
  state: State;
  bus: MessageBus;
  input?: unknown;
}

export interface Result {
  success: boolean;
  data?: unknown;
  nextActions?: NextAction[];
  needsSkill?: string;  // Triggers extend agent
  errors?: string[];
}

export interface NextAction {
  agent: string;
  task: string;
  payload?: unknown;
  priority: number;
}

export interface Agent {
  name: string;
  trigger: "cron" | "event" | "manual";
  run: (ctx: Context) => Promise<Result>;
}

// State interface
export interface State {
  query(sql: string, params?: unknown[]): unknown[];
  exec(sql: string, params?: unknown[]): void;
  get(sql: string, params?: unknown[]): unknown;
}

// Message bus interface
export interface MessageBus {
  emit(channel: string, payload: unknown): void;
  on(channel: string, handler: (payload: unknown) => void): void;
}

// Property model
export interface Property {
  id: string;
  address: string;
  city: string;
  county: string;
  state: string;
  zip: string;
  assessedValue: number;
  marketValue: number;
  taxStatus: "current" | "delinquent" | "unknown";
  lastSaleDate?: string;
  sqft?: number;
  yearBuilt?: number;
  condition: "excellent" | "good" | "fair" | "poor" | "unknown";
  distressSignals: DistressSignal[];
  score: number;
  status: "new" | "hot" | "valued" | "contacted" | "deal";
  createdAt: string;
  updatedAt: string;
}

export interface DistressSignal {
  type: "tax_delinquent" | "foreclosure" | "vacant" | "code_violations" | "utility_shutoff";
  severity: 1 | 2 | 3;  // 3 = highest
  source: string;
  date: string;
}

// Valuation model
export interface Valuation {
  propertyId: string;
  method: "comp" | "income" | "cost";
  estimatedMarketValue: number;
  estimatedRepairCost: number;
  maxOfferPrice: number;
  roiScenario: RoiScenario;
  confidence: number;
  comparables: Comparable[];
  createdAt: string;
}

export interface RoiScenario {
  holdPeriod: number;  // months
  exitPrice: number;
  rentalIncome: number;
}

export interface Comparable {
  address: string;
  salePrice: number;
  saleDate: string;
  sqft: number;
  distance: number;  // miles
}

// Investor/Buyer model
export interface Lead {
  id: string;
  type: "investor" | "developer" | "end_user";
  name: string;
  email?: string;
  phone?: string;
  criteria: InvestmentCriteria;
  status: "new" | "contacted" | "qualified" | "deal";
  source: string;
  score: number;
}

export interface InvestmentCriteria {
  minPrice: number;
  maxPrice: number;
  propertyTypes: string[];
  geographic: string[];
  minRoi: number;
}
