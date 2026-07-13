
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";


interface ColumnMapping {
  csvColumns: string[];
  crmField: string | null;
}

interface MappingStepProps {
  mapping: ColumnMapping[];
  onMappingChange: (
    index: number,
    crmField: string | null
  ) => void;
}

const CRM_FIELDS = [
  { value: "created_at", label: "Created At" },
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "country_code", label: "Country Code" },
  { value: "mobile_without_country_code", label: "Mobile Number" },
  { value: "company", label: "Company" },
  { value: "city", label: "City" },
  { value: "state", label: "State" },
  { value: "country", label: "Country" },
  { value: "lead_owner", label: "Lead Owner" },
  { value: "crm_status", label: "CRM Status" },
  { value: "crm_note", label: "CRM Note" },
  { value: "data_source", label: "Data Source" },
  { value: "possession_time", label: "Possession Time" },
  { value: "description", label: "Description" },
];


export function MappingStep({
    mapping,
    onMappingChange,
}: MappingStepProps) {
    return (
        <div className="mt-6">

            <div className="mb-5">

                <h3 className="text-lg font-semibold sticky top-0 bg-background z-10">
                    Review AI Mapping
                </h3>

                <p className="text-sm text-muted-foreground">
                    Verify the detected mappings before importing.
                </p>

            </div>

            <div className="space-y-3">

                {mapping.map((item, index) => (

                    <div key={index}
                        className="flex items-center justify-between rounded-lg border p-4">

                        <div>

                            {item.csvColumns.map((column) => (

                            <p
                                key={column}
                                className="text-sm font-medium"
                            >
                                {column}
                            </p>

                            ))}

                        </div>

                        <div className="w-64">

                            <Select
                                value={item.crmField ?? "Not Mapped"}
                                onValueChange={(value) =>
                                    onMappingChange(
                                    index,
                                    value === "Not Mapped" ? null : value
                                    )
                                }
                            >
                                <SelectTrigger className="w-64">
                                    <SelectValue placeholder="Select CRM Field" />
                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value={"Not Mapped"}>
                                        Not Mapped
                                    </SelectItem>

                                    {CRM_FIELDS.map((field) => (

                                        <SelectItem
                                            key={field.value}
                                            value={field.value}
                                            >
                                            {field.label}
                                        </SelectItem>

                                    ))}

                                </SelectContent>

                            </Select>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}