
interface CRMRecord {
  created_at?: string;
  name?: string;
  email?: string;
  country_code?: string;
  mobile_without_country_code?: string;
  company?: string;
  city?: string;
  state?: string;
  country?: string;
  lead_owner?: string;
  crm_status?: string;
  crm_note?: string;
  data_source?: string;
  possession_time?: string;
  description?: string;
}

interface InvalidRecord {
  row: CRMRecord;
  errors: string[];
}

interface ImportResult {
  summary: {
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
  };
  validRecords: CRMRecord[];
  invalidRecords: InvalidRecord[];
}

interface ResultStepProps {
  result: ImportResult;
}

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/table";

export function ResultStep({ result }: ResultStepProps) {
  return (
    <div>
        <h2>Import Results</h2>

        <p>Total: {result.summary.totalRecords}</p>
        <p>Valid: {result.summary.validRecords}</p>
        <p>Invalid: {result.summary.invalidRecords}</p>

        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {result.validRecords.map((record, index) => (
                <TableRow key={index}>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.email}</TableCell>
                    <TableCell>{record.mobile_without_country_code}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
    
  );
}