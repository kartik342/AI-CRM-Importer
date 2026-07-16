"use client";

import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle } from "@/components/ui/dialog";
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Papa from "papaparse";
import { UploadStep } from "./upload-step";
import { PreviewStep } from "./preview-step";
import { FileCard } from "./fileCard-step";
import { MappingStep } from "./mapping-step";
import { validateMapping } from "@/components/upload/mapping-validation";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ColumnMapping {
  csvColumns: string[];
  crmField: string | null;
}




export function UploadDialog({ open,onOpenChange }: UploadDialogProps) {

  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [step, setStep] = useState<"upload" | "preview" | "mapping" | "result">("upload");
  const [mapping, setMapping] = useState<ColumnMapping[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileChange = async(
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      const csvText = await file.text();
      // console.log(csvText);

      const { data, errors, meta } = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });
      console.log(data);
      console.log(errors);
      console.log(meta);

      setRows(data as Record<string, string>[]);
      setStep("preview");

    } catch (error) {
      console.error("Failed to read file:", error);
    }
  };

  const resetImporter = () => {
    setFile(null);
    setRows([]);
    setMapping([]);
    setStep("upload");
  };

  const handleGenerateMapping = async () => {
    if (!file) return;

    setIsLoading(true);

    try {
        const formData = new FormData();

        formData.append("file", file);

        const response = await fetch(
          "http://localhost:5000/api/import",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        console.log(result);

        setMapping(result.response.mapping);

        setStep("mapping");
      } finally {
        setIsLoading(false);
    }
  };


  const handleContinue = async () => {
    if (step === "upload") {
      handleImport();
      return;
    }

    if (step === "preview") {
      await handleGenerateMapping();
      return;
    }

    if (step === "mapping") {
      console.log("Inside mapping step");

      const validation = validateMapping(mapping);

      console.log(validation);
      console.log(mapping);

      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }
      setValidationErrors([]);

      console.log("Validation passed");


      // await handleImportData();
    }

  };


  const handleMappingChange = ( index: number, crmField: string | null ) => {
    setMapping((prev) => {
      const updatedMapping = prev.map((item, i) =>
        i === index
          ? { ...item, crmField }
          : item
      );

      console.log(updatedMapping);

      return updatedMapping;
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetImporter();
          }

          onOpenChange(isOpen);
        }}
      >

      <DialogContent className="sm:max-w-xl">

        <DialogHeader>
          <DialogTitle>Import Contacts via CSV</DialogTitle>

          <DialogDescription>
            Upload a CSV file to bulk import contacts into your CRM.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">

            {/* File Upload Area */}
            {step === "upload" && (
                <UploadStep
                    file={file}
                    onFileChange={handleFileChange}
                />
            )}
            

            {/* Selected File Name */}
            {file && (step === "preview" || step === "upload") && (
                <FileCard
                  file={file!}
                  rows={rows}
                  onRemove={() => {
                    setFile(null);
                    setRows([]);
                    setStep("upload");
                  }}
                />
            )}

            {/* Preview Table */}
            {step === "preview" && rows.length > 0 && (
                <PreviewStep rows={rows} />
            )}

            {/* Mapping Step */}
            {step === "mapping" && (
                <MappingStep
                    mapping={mapping}
                    onMappingChange={handleMappingChange}
                    validationErrors={validationErrors}
                />
            )}

        </div>
        

        {/* Footer - Action Buttons */}

        <div className="mt-6 flex items-center justify-between border-t pt-4">

          <Button
            variant="outline"
            onClick={() => {
              switch (step) {
                case "upload":
                  resetImporter();
                  onOpenChange(false);
                  break;

                case "preview":
                  setStep("upload");
                  break;

                case "mapping":
                  setStep("preview");
                  break;

                case "result":
                  setStep("mapping");
                  break;
              }
            }}
          >
            {step === "upload" ? "Cancel" : "Back"}
          </Button>


          <Button
            disabled={!file || isLoading}
            onClick={handleContinue}
          >
            {step === "upload" ? "Continue" : "Import"}
          </Button>

        

        </div>
        
      </DialogContent>

    </Dialog>
  );
}