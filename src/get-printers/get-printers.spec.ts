import getPrinters from "./get-printers";
import { execFileAsync } from "../utils/exec-async";
import { Printer } from "../types";

jest.mock("../utils/exec-async");

const stdout = `printer Virtual_PDF_Printer is idle.  enabled since Tue 30 Mar 2021 11:54:05 PM EEST
Form mounted:
Content types: any
Printer types: unknown
Description: Virtual PDF Printer
Alerts: none
Location:
Connection: direct
Interface: /etc/cups/ppd/Virtual_PDF_Printer.ppd
On fault: no alert
After fault: continue
printer Zebra is idle.  enabled since Tue 09 Feb 2021 12:32:35 AM EET
The printer configuration is incorrect or the printer no longer exists
Form mounted:
Content types: any
Printer types: unknown
Description: Zebra Printer
Alerts: none
Location:
Connection: direct
Interface: /etc/cups/ppd/Zebra_Printer.ppd
On fault: no alert
After fault: continue
`;

afterEach(() => {
  // restore the original implementation.
  execFileAsync.mockRestore();
});

it("return a list of available printers", async () => {
  execFileAsync.mockImplementation(() => Promise.resolve({ stdout }));

  const expected: Printer[] = [
    {
      printer: "Virtual_PDF_Printer",
      description: "Virtual PDF Printer",
      status: "idle",
      connection: "direct",
      alerts: "none",
    },
    {
      printer: "Zebra",
      description: "Zebra Printer",
      status: "idle",
      connection: "direct",
      alerts: "none",
    },
  ];

  await expect(getPrinters()).resolves.toEqual(expected);
});

it("return an empty list when there are no printers installed.", async () => {
  execFileAsync.mockImplementation(() =>
    Promise.resolve({ stdout: "lpstat: No destinations added." })
  );

  await expect(getPrinters()).resolves.toEqual([]);
});

it("fails with an error", async () => {
  execFileAsync.mockImplementation(() => Promise.reject("error"));
  await expect(getPrinters()).rejects.toMatch("error");
});
