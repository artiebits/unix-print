import fs from "fs";
import { ExecResponse } from "../types";
import { execFileAsync } from "../utils/exec-async";

export default async function print(
  file: string,
  printer?: string,
  options?: string[]
): Promise<ExecResponse> {
  if (!file) throw "No file specified";
  if (!fs.existsSync(file)) throw "No such file";

  const args = [file];

  if (printer) {
    args.push("-d", printer);
  }

  if (options) {
    if (!Array.isArray(options)) throw "options should be an array";

    args.push(...options);
  }

  return execFileAsync("lp", args);
}
