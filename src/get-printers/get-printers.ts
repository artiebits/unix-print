import { Printer } from "../types";
import execAsync from "../utils/exec-async";
import parsePrinterDescription from "../utils/parse-printer-description";

export default async function getPrinters(): Promise<Printer[]> {
  try {
    const { stdout } = await execAsync("lpstat -lp", {
      env: { LC_ALL: "en_US" },
    });

    const isThereAnyPrinter = stdout.match("printer");
    if (!isThereAnyPrinter) return [];

    return stdout
      .split(/^printer(.)/gm)
      .filter((line: string) => line.trim().length)
      .map((line: string) => ({
        printer: line.substr(0, line.indexOf(" ")),
        description: parsePrinterDescription(line),
      }));
  } catch (error) {
    throw error;
  }
}
