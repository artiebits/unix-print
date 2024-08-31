import { Printer } from "../types";
import { execFileAsync } from "../utils/exec-async";
import parsePrinterAttribute from "../utils/parse-printer-attribute";

export default async function getDefaultPrinter(): Promise<Printer | null> {
  try {
    const { stdout } = await execFileAsync("lpstat", ["-d"]);
    const printer = getPrinterName(stdout);
    if (!printer) return null;
    return await getPrinterData(printer);
  } catch (error) {
    throw error;
  }
}

function getPrinterName(output: string): string {
  const startIndex = output.indexOf(":");
  return startIndex === -1 ? "" : output.substr(startIndex + 1).trim();
}

async function getPrinterData(printer: string): Promise<Printer> {
  const { stdout } = await execFileAsync("lpstat", ["-lp", printer]);
  return {
    printer,
    status: stdout.split(/.*is\s(\w+)\..*/gm)[1],
    description: parsePrinterAttribute(stdout, "Description"),
    alerts: parsePrinterAttribute(stdout, "Alerts"),
    connection: parsePrinterAttribute(stdout, "Connection"),
  };
}
