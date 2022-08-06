export default function parsePrinterAttribute(
  stdout: string,
  attribute: string
): string {
  const attributeLine = stdout
    .split("\n")
    .slice(1)
    .find((line: string) => line.indexOf(attribute) !== -1);
  return attributeLine ? attributeLine.split(":")[1].trim() : "";
}
