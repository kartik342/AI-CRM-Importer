


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PreviewStepProps {
  rows: Record<string, string>[];
}

export const PreviewStep = ({ rows }: PreviewStepProps) => {
  return (
    <div className="mt-6 overflow-x-auto scrollbar-hide">

        <div className="mb-3">
            <h3 className="text-lg font-semibold">
            CSV Preview
            </h3>

            <p className="text-sm text-muted-foreground">
            Showing first {Math.min(rows.length, 10)} of {rows.length} rows
            </p>
        </div>

            <div className="max-h-80 overflow-y-auto scrollbar-hide rounded-lg border">
            <Table >
            <TableHeader>
                <TableRow>
                {Object.keys(rows[0]).map((column) => (

                    <TableHead
                    key={column}
                    className="bg-muted text-sm font-bold text-foreground"
                    >
                    {column}
                    </TableHead>

                ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.slice(0, 10).map((row, index) => (
                <TableRow
                    key={index}
                    className="hover:bg-blue-100"
                >
                    {Object.values(row).map((value, i) => (
                    <TableCell
                        key={i}
                        className="max-w-48 truncate"
                        >
                        {value}
                    </TableCell>
                    ))}
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
    </div>
  )
}

