import { execFileAsync } from "../utils/exec-async";
import { getRequestId, default as isPrintComplete } from "./parse-response";

jest.mock("../utils/exec-async");
jest.mock("../get-default-printer/get-default-printer");

const queuedStdout = `lp0-39   username             15360   Mon 12 Jun 2023 21:09:48`;

describe("getRequestId", () => {
  it("returns the job id", async () => {
    const response = {
      stdout: "request id is myDummyPrinter-15 (1 file(s))",
      stderr: null,
    };
    const expected = "myDummyPrinter-15";

    expect(getRequestId(response)).toEqual(expected);
  });

  it("returns -1 on weird input", async () => {
    const response = {
      stdout: "printer is offline or something/manually passing stuff",
      stderr: null,
    };
    const expected = null;

    expect(getRequestId(response)).toEqual(expected);
  });

  it("returns -1 when response is empty", async () => {
    const response = { stdout: "", stderr: null };
    const expected = null;

    expect(getRequestId(response)).toEqual(expected);
  });

  it("returns -1 when response is null", async () => {
    const response = { stdout: null, stderr: null };
    const expected = null;

    expect(getRequestId(response)).toEqual(expected);
  });
});

describe("isPrintComplete", () => {
  beforeEach(() => {
    execFileAsync.mockImplementationOnce(() =>
      Promise.resolve({ stdout: queuedStdout })
    );
  });

  afterEach(() => {
    // restore the original implementation.
    execFileAsync.mockRestore();
  });

  it("job is still on the queue", async () => {
    const printResponse = {
      stdout: "request id is lp0-39 (1 file(s))",
      stderr: null,
    };

    const result = isPrintComplete(printResponse);

    await expect(result).resolves.toEqual(false);
    expect(execFileAsync).toBeCalledWith("lpstat", ["-o", "lp0"]);
  });

  it("job is not on the queue", async () => {
    const printResponse = {
      stdout: "request id is lp0-12 (1 file(s))",
      stderr: null,
    };

    const result = isPrintComplete(printResponse);

    await expect(result).resolves.toEqual(true);
  });

  it("nothing on the queue", async () => {
    const printResponse = {
      stdout: "request id is lp0-39 (1 file(s))",
      stderr: null,
    };
    execFileAsync.mockRestore();
    execFileAsync.mockImplementationOnce(() => Promise.resolve({ stdout: "" }));

    const result = isPrintComplete(printResponse);

    await expect(result).resolves.toEqual(true);
  });

  it("getJobId didn't work", async () => {
    const printResponse = {
      stdout: "printer is offline or something/manually passing stuff",
      stderr: null,
    };

    const result = isPrintComplete(printResponse);

    await expect(result).resolves.toEqual(false);
  });
});
