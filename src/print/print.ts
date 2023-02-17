import fs from "fs";
import execAsync from "../utils/exec-async";
import {getJobId} from "../utils/parse-response";

export default async function print(
	file: string,
	printer?: string,
	options?: string[]
) {
	if (!file) throw "No file specified";
	if (!fs.existsSync(file)) throw "No such file";

	const args = [`'${file}'`];

	if (printer) {
		args.push("-d", printer);
	}

	if (options) {
		if (!Array.isArray(options)) throw "options should be an array";

		options.forEach((arg) => args.push(arg));
	}

	const printResponse = await execAsync(`lp ${args.join(" ")}`);
	const jobId = getJobId(printResponse);

	return jobId;
}
