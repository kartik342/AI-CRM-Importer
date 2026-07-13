export interface ColumnMapping {
  csvColumns: string[];
  crmField: string | null;
}

export interface GeminiMappingResponse {
  version: number;
  mapping: ColumnMapping[];
}