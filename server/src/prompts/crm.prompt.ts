
const exampleMappingResponse = {
  version: 1,
  mapping: [
    {
      csvColumns: ["Full Name"],
      crmField: "name",
    },
    {
      csvColumns: ["Company"],
      crmField: "company",
    },
  ],
};

export function buildCrmPrompt(
  headers: string[],
  sampleRows: Record<string, string>[]
) {
  return `
You are an AI assistant that maps CSV columns to CRM fields.

Your task is ONLY to identify which CSV column corresponds to which CRM field.
Your responsibility is ONLY schema mapping.

Do NOT:
- Transform row data.
- Validate records.
- Skip records.
- Generate CRM records.
- Count imported or skipped records.
- Infer missing values.

Allowed CRM fields:
- created_at
- name
- email
- country_code
- mobile_without_country_code
- company
- city
- state
- country
- lead_owner
- crm_status
- crm_note
- data_source
- possession_time
- description

Common Header Variations:

- name:
  Full Name
  Name
  Customer Name
  Contact Name
  First Name + Last Name

- email:
  Email
  Email Address
  Work Email
  Office Email
  E-mail

- mobile_without_country_code:
  Phone
  Phone Number
  Phone 1
  Phone 2
  Mobile
  Mobile Number
  Mobile No
  Cell
  Contact Number

- company:
  Company
  Company Name
  Organization
  Organisation
  Business

- created_at:
  Created At
  Created On
  Creation Date
  Subscription Date
  Signup Date

- city:
  City
  Town

- state:
  State
  Province
  Region

- country:
  Country
  Nation

- crm_note:
  Remarks
  Notes
  Comments
  Follow Up
  Description

Field Hints:

crm_status can contain only one of:
- GOOD_LEAD_FOLLOW_UP
- DID_NOT_CONNECT
- BAD_LEAD
- SALE_DONE

data_source can contain only one of:
- leads_on_demand
- meridian_tower
- eden_park
- varah_swamy
- sarjapur_plots

created_at represents the lead creation date.
crm_note represents remarks, comments, follow-up notes or additional information.

CSV Headers:
${JSON.stringify(headers, null, 2)}

Sample Rows:
${JSON.stringify(sampleRows, null, 2)}

Rules:

1. Return ONLY the JSON object.Do not wrap the JSON in Markdown code fences such as \`\`\`json or \`\`\`.
Do not include any explanatory text before or after the JSON.
2. Do NOT include markdown, code fences, comments, or explanations.
3. Use ONLY the allowed CRM fields listed above.
4. Never invent new CRM field names.
5. If a CSV column does not clearly match an allowed CRM field, set "crmField" to null.
6. Preserve the original CSV column names exactly as they appear in the input.
7. Return one mapping object for every mapped CRM field.
8. If multiple CSV columns together represent one CRM field, include all of them in the "csvColumns" array.
9. Each CSV column should appear at most once across all mappings.

If multiple CSV columns together represent a single CRM field,
return all of them inside "csvColumns".

Example:

{
  "csvColumns": ["First Name", "Last Name"],
  "crmField": "name"
}

Return JSON in exactly this format:

${JSON.stringify(exampleMappingResponse, null, 2)}
`;
}