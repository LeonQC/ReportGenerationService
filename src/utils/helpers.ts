import { ReportType } from "@prisma/client";
export const getFileExtension = (mimeType: string): string => {
  switch (mimeType) {
    case "APPLICATION_PDF":
      return "pdf";
    case "TEXT_CSV":
      return "csv";
    case "APPLICATION_JSON":
      return "json";
    default:
      return "bin";
  }
};

export const getMimeTypeString = (mimeType: string): string => {
  switch (mimeType) {
    case "APPLICATION_PDF":
      return "application/pdf";
    case "TEXT_CSV":
      return "text/csv";
    case "APPLICATION_JSON":
      return "application/json";
    default:
      return "application/octet-stream";
  }
};

export const getReportType = (reportType: string): string => {
  switch (reportType) {
    case "STOCK_SUMMARY":
      return "Stock Summary";
    case "MACRO_TRENDS":
      return "Macro Trends";
    case "CUSTOM":
      return "Custom Report";
    default:
      return "Custom Report";
  }
};

export const convertUTCToLocal = (utcDate: string): string => {
  const date = new Date(utcDate)
    .toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
  return date;
};

export const generateFallBackFileName = (reportType: ReportType): string => {
  const date = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const type = getReportType(reportType);
  return `${type} report - ${date}`;
};
