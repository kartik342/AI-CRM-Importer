interface ColumnMapping {
  csvColumns: string[];
  crmField: string | null;
}

export interface MappingValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateMapping(
  mapping: ColumnMapping[]
): MappingValidationResult {

    const errors: string[] = [];
    
    const hasMappedField = mapping.some(
        (item) => item.crmField !== null
    );

    if (!hasMappedField) {
        errors.push("Map at least one CRM field before importing.");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}