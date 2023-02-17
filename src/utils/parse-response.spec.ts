import execAsync from "../utils/exec-async";
import {getJobId} from "./parse-response";

jest.mock("../utils/exec-async");

const stdout = `Queue  Dev      Status      Job    Files      User      PP      %      Blks      CP      Rnk
lp0    dlp0     running     39     motd       guest     10      83      12        1       1
`;

afterEach(() => {
	// restore the original implementation.
	execAsync.mockRestore();
});

describe("getJobId", () => {
	it("returns the job id", async () => {
		const response = "request id is myDummyPrinter-15 (1 file(s))";
		const expected = 15;

		expect(getJobId(response)).toEqual(expected);
	});

	it("returns -1 on weird input", async () => {
		const response =
			"printer is offline or something / manually passing in stuff";
		const expected = -1;

		expect(getJobId(response)).toEqual(expected);
	});

	it("returns -1 when response is empty", async () => {
		const response = "";
		const expected = -1;

		expect(getJobId(response)).toEqual(expected);
	});
});
