

interface PreviewStepProps {
  file: File;
  rows: Record<string, string>[];
  onRemove: () => void;
}


export const FileCard = ({ file, rows, onRemove }: PreviewStepProps) => {
  return (
    <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted p-3">
        <div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(1)} KB

            {rows.length > 0 && (
                <>
                {" • "}
                {rows.length} rows
                {" • "}
                {Object.keys(rows[0]).length} columns
                </>
            )}
            </p>
        </div>

        <button
            type="button"
            onClick={onRemove}
            className="text-sm text-red-500 hover:text-red-600"
        >
            Remove
        </button>
    </div>
  )
}

