import getDefaultPrinter from "./get-default-printer";
import { execFileAsync } from "../utils/exec-async";
import { Printer } from "../types";

jest.mock("../utils/exec-async");

const defaultPrinterStdout = `system default destination: Virtual_PDF_Printer
`;

const defaultPrinterDetailsStdout = `printer Virtual_PDF_Printer is idle.  enabled since Mon 12 Apr 2021 01:35:20 PM EEST
Form mounted:
Content types: any
Printer types: unknown
Description: Virtual PDF Printer
Alerts: none
Location:
Connection: direct
Interface: /etc/cups/ppd/Virtual_PDF_Printer.ppd
`;

afterEach(() => {
  // restore the original implementation.
  execFileAsync.mockRestore();
});

it("returns the system default printer", async () => {
  execFileAsync
    .mockImplementationOnce(() =>
      Promise.resolve({ stdout: defaultPrinterStdout })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ stdout: defaultPrinterDetailsStdout })
    );

  const expected: Printer = {
    printer: "Virtual_PDF_Printer",
    description: "Virtual PDF Printer",
    status: "idle",
    connection: "direct",
    alerts: "none",
  };

  await expect(getDefaultPrinter()).resolves.toEqual(expected);
  await expect(execFileAsync).toBeCalledWith("lpstat", ["-d"]);
});

it("returns null when the default printer is not defined", async () => {
  execFileAsync.mockImplementation(() =>
    Promise.resolve({ stdout: "no system default destination" })
  );

  await expect(getDefaultPrinter()).resolves.toBeNull();
});

it("fails with an error", async () => {
  execFileAsync.mockImplementation(() => Promise.reject("error"));
  await expect(getDefaultPrinter()).rejects.toMatch("error");
});
