import { CRMRecord } from "../types/crm";

export interface InvalidRecord {
  row: CRMRecord;
  errors: string[];
}

export interface ValidationResult {
  validRecords: CRMRecord[];
  invalidRecords: InvalidRecord[];
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email.trim());
}

function isValidPhone(phone: string): boolean {
  const cleanedPhoneNo = phone.replace(/\D/g, "");

  const phoneRegex = /^\d{7,15}$/;

  return phoneRegex.test(cleanedPhoneNo);
}

export function validateRows(rows: CRMRecord[]): ValidationResult {
  const validRecords: CRMRecord[] = [];
  const invalidRecords: InvalidRecord[] = [];

  for (const row of rows) {
    const errors: string[] = [];

    if (!row.name?.trim()) {
      errors.push("Name is required.");
    }

    const hasEmail = Boolean(row.email?.trim());
    const hasMobile = Boolean(
      row.mobile_without_country_code?.trim()
    );
    
    if (!hasEmail && !hasMobile) {
      errors.push("Record must contain either an email or a mobile number.");
    }

    if (row.email && !isValidEmail(row.email)) {
        errors.push("Invalid email format.");
    }

    if (row.mobile_without_country_code &&!isValidPhone(row.mobile_without_country_code)) {
        errors.push("Invalid mobile number.");
    }

    if (errors.length > 0) {
      invalidRecords.push({
        row,
        errors,
      });
    } else {
      validRecords.push(row);
    }
  }

  return {
    validRecords,
    invalidRecords,
  };
}