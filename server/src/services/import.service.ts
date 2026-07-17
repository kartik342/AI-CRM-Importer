import Papa from "papaparse";
import { CRMRecord } from "../types/crm";

interface ColumnMapping {
  csvColumns: string[];
  crmField: keyof CRMRecord | null;
}

export function parseCsv(file: Express.Multer.File) {
  const csv = file.buffer.toString("utf-8");

  const { data, errors } = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) {
    throw new Error("Failed to parse CSV file.");
  }

  return data;
}

const MERGE_FIELDS: (keyof CRMRecord)[] = [
  "name",
  "description",
  "crm_note",
];


export function transformRows(
  rows: Record<string, string>[],
  mapping: ColumnMapping[]
): CRMRecord[] {
  return rows.map((row) => {
    const crmRecord: CRMRecord = {};

    for (const map of mapping) {
      // Skip unmapped fields
      if (!map.crmField) {
        continue;
      }

      // Get values from all mapped CSV columns
      const values = map.csvColumns
        .map((column) => row[column]?.trim())
        .filter((value) => value);

      // Skip if no value exists
      if (values.length === 0) {
        continue;
      }

      // Merge only fields that should combine multiple CSV columns
      if (MERGE_FIELDS.includes(map.crmField)) {
        crmRecord[map.crmField] = values.join(" ");
      } else {
        // For fields like email, phone, company, city, etc.
        // use only the first mapped value.
        crmRecord[map.crmField] = values[0];
      }
    }

    return crmRecord;
  });
}