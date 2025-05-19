// src/utils/pdfGenerator.ts
import PDFDocument from "pdfkit";
import { ReportOverview } from "../types/alphavantage";

export async function generateStockOverviewPDF(
  data: ReportOverview
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Title
    doc.fontSize(18).text(`📈 Stock Overview: ${data.Name} (${data.Symbol})`, {
      underline: true,
    });
    doc.moveDown();

    // Basic Info
    doc.fontSize(12);
    doc.text(`Exchange: ${data.Exchange}`);
    doc.text(`Sector: ${data.Sector}`);
    doc.text(`Industry: ${data.Industry}`);
    doc.text(`Currency: ${data.Currency}`);
    if (data.MarketCapitalization) {
      doc.text(
        `Market Cap: $${Number(data.MarketCapitalization).toLocaleString()}`
      );
    }
    doc.text(`P/E Ratio: ${data.PERatio}`);
    doc.text(`Dividend Yield: ${data.DividendYield}`);
    doc.moveDown();

    // Description
    doc.font("Helvetica-Bold").text("Company Description");
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(data.Description || "No description available", {
        align: "justify",
      });

    doc.end();
  });
}
