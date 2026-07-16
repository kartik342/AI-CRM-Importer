import { Request, Response } from "express";
import Papa from "papaparse";
import { extractCRMData } from "../services/gemini.service";
import { parseCsv, transformRows } from "../services/import.service";
import { validateRows } from "../services/validation.service";

export const importContacts = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "CSV file is required",
      });
    }

    const csvText = req.file.buffer.toString("utf-8");

    const { data, errors } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const aiResponse = await extractCRMData(
        data as Record<string, string>[]
    );

    return res.status(200).json({
        success: true,
        response: aiResponse,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const importRecords = async (
  req: Request,
  res: Response
) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required.",
      });
    }

    const mapping = JSON.parse(req.body.mapping);
    
    const rows = parseCsv(file);

    const crmRecords = transformRows(rows, mapping);

    const { validRecords, invalidRecords } = validateRows(crmRecords);

    console.log(crmRecords);

    console.log(rows);

    console.log(mapping);

    return res.status(200).json({
      success: true,
      message: "Records processed successfully.",
      summary: {
        totalRecords: crmRecords.length,
        validRecords: validRecords.length,
        invalidRecords: invalidRecords.length,
      },
      validRecords,
      invalidRecords,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to import records.",
    });
  }
};