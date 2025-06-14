import { stringify } from "csv-stringify/sync";

export const generateCSVBuffer = async (
  data: object | object[]
): Promise<Buffer> => {
  const arrayData = Array.isArray(data) ? data : [data];

  const csv = stringify(arrayData, { header: true });
  return Buffer.from(csv, "utf-8");
};
