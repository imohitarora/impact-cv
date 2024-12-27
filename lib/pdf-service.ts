import pdf from "pdf-parse";

export async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const data = await pdf(Buffer.from(arrayBuffer));
  return data.text;
}
