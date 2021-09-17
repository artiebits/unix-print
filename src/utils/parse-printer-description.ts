export default function parsePrinterDescription(stdout: string): string {
  const descriptionLine = stdout
    .split("\n")
    .slice(1)
    .find((line: string) => line.indexOf("Description") !== -1);
  return descriptionLine ? descriptionLine.split(":")[1].trim() : "";
}
