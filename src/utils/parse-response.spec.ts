import execAsync from "../utils/exec-async";
import { getRequestId, default as isPrintComplete } from "./parse-response";

jest.mock("../utils/exec-async");
jest.mock("../get-default-printer/get-default-printer");

const queuedStdout = `Queue\tDev\tStatus\tJob\tFiles\tUser\tPP\t%\tBlks\tCP\tRnk
lp0\tdlp0\trunning\t39\tmotd\tguest\t10\t83\t12\t1\t1
`;

describe("getRequestId", () => {
  it("returns the job id", async () => {
    const response = { stdout: "request id is myDummyPrinter-15 (1 file(s))", stderr: null };
    const expected = "myDummyPrinter-15";

    expect(getRequestId(response)).toEqual(expected);
  });

  it("returns -1 on weird input", async () => {
    const response = { stdout: "printer is offline or something/manually passing stuff", stderr: null };
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
    execAsync.mockImplementationOnce(() => Promise.resolve(queuedStdout));
  });

  afterEach(() => {
    // restore the original implementation.
    execAsync.mockRestore();
  });

  it("job is still on the queue", async () => {
    const printResponse = { stdout: "request id is lp0-39 (1 file(s))", stderr: null };

    const result = isPrintComplete(printResponse);

    await expect(result).resolves.toEqual(false);
    expect(execAsync).toBeCalledWith(`lpstat -o lp0`);
  });

  it("job is not on the queue", async () => {
    const printResponse =  { stdout: "request id is lp0-12 (1 file(s))", stderr: null };

    const result = isPrintComplete(printResponse);

    await expect(result).resolves.toEqual(true);
  });

  it("nothing on the queue", async () => {
    const printResponse =  { stdout: "request id is lp0-39 (1 file(s))", stderr: null };
    execAsync.mockRestore();
    execAsync.mockImplementationOnce(() => Promise.resolve("\n"));

    const result = isPrintComplete(printResponse);

    await expect(result).resolves.toEqual(true);
  });

  it("getJobId didn't work", async () => {
    const printResponse = { stdout: "printer is offline or something/manually passing stuff", stderr: null };

    const result = isPrintComplete(printResponse);

    await expect(result).resolves.toEqual(false);
  });
});
