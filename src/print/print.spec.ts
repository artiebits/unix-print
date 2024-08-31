import { existsSync } from "fs";
import { execFileAsync } from "../utils/exec-async";
import print from "./print";

jest.mock("fs");
jest.mock("path");
jest.mock("../utils/exec-async");

beforeEach(() => {
  // override the implementations
  existsSync.mockImplementation(() => true);
  execFileAsync.mockImplementation(() =>
    Promise.resolve({ stdout: "request id is myDummyPrinter-15 (1 file(s))" })
  );
});

afterEach(() => {
  // restore the original implementations
  existsSync.mockRestore();
  execFileAsync.mockRestore();
});

it("throws when no file is specified.", async () => {
  await expect(print()).rejects.toMatch("No file specified");
});

it("throws when file not found", async () => {
  existsSync.mockImplementation(() => false);

  await expect(print("file.txt")).rejects.toMatch("No such file");
});

it("sends the PDF file to the default printer", async () => {
  const filename = "file.txt";

  await print(filename);

  expect(execFileAsync).toHaveBeenCalledWith("lp", [filename]);
});

it("sends PDF file to the specific printer", async () => {
  const filename = "file.pdf";
  const printer = "Zebra Printer";

  await print(filename, printer);

  expect(execFileAsync).toHaveBeenCalledWith("lp", [filename, "-d", printer]);
});

it("allows to pass other print options", async () => {
  const filename = "file.pdf";
  const printer = "Zebra";
  const options = ["-o landscape", "-o fit-to-page", "-o media=A4"];

  await print(filename, printer, options);

  expect(execFileAsync).toHaveBeenCalledWith("lp", [
    filename,
    "-d",
    printer,
    "-o landscape",
    "-o fit-to-page",
    "-o media=A4",
  ]);
});

it("allows to pass options but omit the printer name", async () => {
  const filename = "assets/file.pdf";
  const options = ["-o landscape", "-o fit-to-page", "-o media=A4"];

  await print(filename, undefined, options);

  expect(execFileAsync).toHaveBeenCalledWith("lp", [
    filename,
    "-o landscape",
    "-o fit-to-page",
    "-o media=A4",
  ]);
});

it("throws if options passed not as an array", async () => {
  const filename = "file.pdf";
  const options = "-o sides=one-sided";

  // @ts-ignore
  await expect(print(filename, undefined, options)).rejects.toMatch(
    "options should be an array"
  );
});
