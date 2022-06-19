import { Printer } from "../types";
import execAsync from "../utils/exec-async";
import parsePrinterDescription from "../utils/parse-printer-description";

export default async function getDefaultPrinter(): Promise<Printer | null> {
  try {
    const { stdout } = await execAsync("lpstat -d", {
      env: { LC_ALL: "en_US" },
    });
    const printer = getPrinterName(stdout);
    if (!printer) return null;
    return {
      printer,
      description: await getPrinterDescription(printer),
    };
  } catch (error) {
    throw error;
  }
}

function getPrinterName(output: string): string {
  const startIndex = output.indexOf(":");
  return startIndex === -1 ? "" : output.substr(startIndex + 1).trim();
}

async function getPrinterDescription(printer: string): Promise<string> {
  const { stdout } = await execAsync(`lpstat -lp ${printer}`, {
    env: { LC_ALL: "en_US" },
  });
  return parsePrinterDescription(stdout);
}
