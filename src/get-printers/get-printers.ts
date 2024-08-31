import { Printer } from "../types";
import { execFileAsync } from "../utils/exec-async";
import parsePrinterAttribute from "../utils/parse-printer-attribute";

export default async function getPrinters(): Promise<Printer[]> {
  try {
    const { stdout } = await execFileAsync("lpstat", ["-lp"]);

    const isThereAnyPrinter = stdout.match("printer");
    if (!isThereAnyPrinter) return [];

    return stdout
      .split(/^printer(.)/gm)
      .filter((line: string) => line.trim().length)
      .map((line: string) => ({
        printer: line.substr(0, line.indexOf(" ")),
        status: line.split(/.*is\s(\w+)\..*/gm)[1],
        description: parsePrinterAttribute(line, "Description"),
        alerts: parsePrinterAttribute(line, "Alerts"),
        connection: parsePrinterAttribute(line, "Connection"),
      }));
  } catch (error) {
    throw error;
  }
}
