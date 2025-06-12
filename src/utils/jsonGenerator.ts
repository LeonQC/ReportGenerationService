export const generateJsonBuffer = async (
  data: object | object[]
): Promise<Buffer> => {
  const jsonString = JSON.stringify(data, null, 2);
  return Buffer.from(jsonString, "utf-8");
};
