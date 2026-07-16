import { Request, Response } from "express";
import Papa from "papaparse";
import { extractCRMData } from "../services/gemini.service";

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

