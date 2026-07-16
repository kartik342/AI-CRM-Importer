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

      // Merge multiple columns with a single space
      crmRecord[map.crmField] = values.join(" ");
    }

    return crmRecord;
  });
}