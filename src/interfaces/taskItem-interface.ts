import { FilingTypes } from '@/enums'

/** A task item in the Todo List. */
export interface TaskItemIF {
  filingType: FilingTypes;
  id: number;
  title: string;
  draftTitle?: string;
  subtitle?: string;
  ARFilingYear: number; // for AR only
  status: string;
  enabled: boolean;
  order: number;
  paymentToken?: number;
  nextArDate?: string; // for AR Todo only
  bcolErrObj?: any;
  correctedFilingId?: number; // for correction only
  correctedFilingType?: string; // for correction only
  isEmptyFiling?: boolean; // for IA only
  nameRequest?: any; // for IA only
}
