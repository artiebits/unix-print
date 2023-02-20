import getDefaultPrinter from "../get-default-printer/get-default-printer";
import {Printer} from "../types";
import execAsync from "../utils/exec-async";
import {getRequestId, isPrintComplete} from "./parse-response";

jest.mock("../utils/exec-async");
jest.mock("../get-default-printer/get-default-printer");

const queuedStdout = `Queue\tDev\tStatus\tJob\tFiles\tUser\tPP\t%\tBlks\tCP\tRnk
lp0\tdlp0\trunning\t39\tmotd\tguest\t10\t83\t12\t1\t1
`;

const defQueuedStdout = `Queue\tDev\tStatus\tJob\tFiles\tUser\tPP\t%\tBlks\tCP\tRnk
Virtual_PDF_Printer\tdlp0\trunning\t39\tmotd\tguest\t10\t83\t12\t1\t1
`;

const defaultPrinter: Printer = {
	printer: "Virtual_PDF_Printer",
	description: "Virtual PDF Printer",
	status: "idle",
	connection: "direct",
	alerts: "none",
};

beforeEach(() => {
	getDefaultPrinter.mockImplementation(() => Promise.resolve(defaultPrinter));
});

afterEach(() => {
	// restore the original implementation.
	execAsync.mockRestore();
});

describe("getJobId", () => {
	it("returns the job id", async () => {
		const response = "request id is myDummyPrinter-15 (1 file(s))";
		const expected = 15;

		expect(getRequestId(response)).toEqual(expected);
	});

	it("returns -1 on weird input", async () => {
		const response = "printer is offline or something/manually passing stuff";
		const expected = -1;

		expect(getRequestId(response)).toEqual(expected);
	});

	it("returns -1 when response is empty", async () => {
		const response = "";
		const expected = -1;

		expect(getRequestId(response)).toEqual(expected);
	});
});

describe("isPrintComplete", () => {
	it("job is still on the queue / default printer", async () => {
		const queuedJobId = 39;
		execAsync.mockImplementationOnce(() => Promise.resolve(defQueuedStdout));

		const result = isPrintComplete(queuedJobId);

		await expect(result).resolves.toEqual(false);
		expect(execAsync).toBeCalledWith(`lpstat -o ${defaultPrinter.printer}`);
	});

	it("job is still on the queue / defined printer", async () => {
		const queuedJobId = 39;
		execAsync.mockImplementationOnce(() => Promise.resolve(queuedStdout));

		const result = isPrintComplete(queuedJobId, "lp0");

		await expect(result).resolves.toEqual(false);
		expect(execAsync).toBeCalledWith(`lpstat -o lp0`);
	});

	it("job is still on the queue / no default or defined printer ", async () => {
		const queuedJobId = 39;
		getDefaultPrinter.mockImplementation(() => Promise.resolve(null));
		execAsync.mockImplementationOnce(() => Promise.resolve(queuedStdout));

		const result = isPrintComplete(queuedJobId);

		await expect(result).resolves.toEqual(false);
		expect(execAsync).toBeCalledWith("lpstat ");
	});

	it("job is not on the queue", async () => {
		const queuedJobId = 5;
		execAsync.mockImplementationOnce(() => Promise.resolve(queuedStdout));

		const result = isPrintComplete(queuedJobId);

		await expect(result).resolves.toEqual(true);
	});

	it("nothing on the queue", async () => {
		const queuedJobId = 5;
		execAsync.mockImplementationOnce(() => Promise.resolve("\n"));

		const result = isPrintComplete(queuedJobId);

		await expect(result).resolves.toEqual(true);
	});

	it("getJobId didn't work", async () => {
		const queuedJobId = -1;
		execAsync.mockImplementationOnce(() => Promise.resolve(queuedStdout));

		const result = isPrintComplete(queuedJobId);

		await expect(result).resolves.toEqual(false);
	});
});
