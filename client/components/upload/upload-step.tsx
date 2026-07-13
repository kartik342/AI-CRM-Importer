

interface UploadStepProps {
  file: File | null;
  onFileChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export function UploadStep({ file, onFileChange }: UploadStepProps) {

  if (file) return null;

  return (
        // upload box
        <div className="mt-4">
            <label
                htmlFor="csv-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-10 text-center transition hover:border-blue-500"
            >
                <p className="text-lg font-medium">
                Click to upload a CSV file
                </p>

                <p className="mt-2 text-sm text-gray-500">
                or drag and drop it here
                </p>

                <input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={onFileChange}
                />
            </label>
        </div>
  );
}