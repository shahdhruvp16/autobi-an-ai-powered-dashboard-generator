
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, CsvData, ChartType } from '../types';

const getCsvSnippet = (data: CsvData): string => {
  if (!data.length) return "";
  const headers = Object.keys(data[0]).join(',');
  const rows = data.slice(0, 5).map(row => Object.values(row).join(',')).join('\n');
  return `${headers}\n${rows}`;
};

export const analyzeData = async (csvData: CsvData): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const csvSnippet = getCsvSnippet(csvData);

  const availableChartTypes: ChartType[] = ['line', 'bar', 'scatter', 'pie', 'area', 'donut', 'grouped-bar', 'stacked-bar', 'funnel', 'kpi'];

  const prompt = `
You are an expert data analyst AI called AutoBI. Your task is to analyze a given CSV data snippet and generate a structured JSON object for building a business intelligence dashboard.

Here is the CSV data (headers and first 5 rows):
---
${csvSnippet}
---

Based on this data, provide the following in a single JSON object, adhering strictly to the schema provided:

1.  **dataType**: A single, concise string identifying the type of data (e.g., "Sales", "Finance", "HR", "IoT").
2.  **suggestedTemplate**: The name of the most appropriate dashboard template from this list: ["Business / Finance", "Sales / Marketing", "HR / People Analytics", "Operations / Manufacturing", "Academic / Research Analytics"].
3.  **summary**: A 2-3 sentence executive summary highlighting the most important takeaway from the data.
4.  **insights**: An array of 3 short, impactful, presentation-ready bullet points for a pitch deck. Each bullet point should be a string.
5.  **chartSuggestions**: An array of exactly 4 chart suggestions. For each object in the array:
    *   \`title\`: A descriptive title for the chart.
    *   \`chartType\`: The best initial chart type for the data. Choose from: ${availableChartTypes.join(', ')}.
    *   \`compatibleChartTypes\`: An array of strings listing ALL chart types from the available list that are compatible with this specific data visualization. The first item in this array should be the same as \`chartType\`.
    *   \`x_axis\`: The exact column name from the CSV for the x-axis or labels. For 'pie' or 'donut', this is the label field. For 'kpi', this should be null.
    *   \`y_axis\`: The exact column name from the CSV for the y-axis or values. For 'pie' or 'donut', this is the value field. For 'kpi', this is the column to aggregate.
    *   \`grouping_column\`: (Optional) If suggesting 'grouped-bar' or 'stacked-bar', provide the column name to group or stack by. Otherwise, this should be null. For scatter plots, you may use this for the x-axis coordinate if it differs from the main \`x_axis\` label.
6.  **filterableColumns**: An array of up to 3 string values, where each string is a column name from the CSV that would be ideal for use as a dashboard filter. Choose categorical columns with a limited number of unique values. If no suitable columns are found, provide an empty array.

Important Rules:
- The column names for \`x_axis\`, \`y_axis\`, \`grouping_column\`, and \`filterableColumns\` must exactly match the headers in the provided CSV data.
- For a 'kpi' chart, make the title a key metric (e.g., "Total Revenue"), set \`y_axis\` to the column to be summed, and set \`x_axis\` and \`grouping_column\` to null.
- Ensure the chosen columns are appropriate for the chart type.
- The entire response must be a single, valid JSON object.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dataType: { type: Type.STRING },
          suggestedTemplate: { type: Type.STRING },
          summary: { type: Type.STRING },
          insights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          chartSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                chartType: { type: Type.STRING },
                compatibleChartTypes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                title: { type: Type.STRING },
                x_axis: { type: Type.STRING, nullable: true },
                y_axis: { type: Type.STRING },
                grouping_column: { type: Type.STRING, nullable: true },
              },
              required: ["chartType", "compatibleChartTypes", "title", "y_axis"],
            },
          },
          filterableColumns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              nullable: true,
          }
        },
        required: ["dataType", "suggestedTemplate", "summary", "insights", "chartSuggestions"],
      },
    },
  });

  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", jsonText);
    throw new Error("Received invalid JSON from the AI model.");
  }
};
