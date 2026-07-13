import { GoogleGenAI } from "@google/genai";
import { buildCrmPrompt } from "../prompts/crm.prompt";
import { GeminiMappingResponse } from "../types/gemini";

export const extractCRMData = async (
  rows: Record<string, string>[]
) => {
    
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY!,
    });

    const headers = Object.keys(rows[0] ?? {});
    const sampleRows = rows.slice(0, 5); // Take the first 5 rows as sample data

    const prompt = buildCrmPrompt(headers, sampleRows);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    const text = response.text;

    const cleanedText = text?.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();

    if (!cleanedText) {
    throw new Error("Gemini returned an empty response.");
    }

    const mapping: GeminiMappingResponse = JSON.parse(cleanedText);

    if (!Array.isArray(mapping.mapping)) {
        throw new Error("Invalid Gemini response format.");
    }
    
    for (const item of mapping.mapping) {
        if (item.csvColumns.length === 0) {
            throw new Error("csvColumns cannot be empty.");
        }
        if (
            !Array.isArray(item.csvColumns) ||
            !item.csvColumns.every(column => typeof column === "string") ||
            (item.crmField !== null && typeof item.crmField !== "string")
        ) {
            throw new Error("Invalid mapping item.");
        }
    }

    console.log("Parsed Mapping:", mapping);
    return mapping;
};