import getDefaultPrinter from "../get-default-printer/get-default-printer";
import execAsync from "./exec-async";

export const getJobId = (printResponse = "") => {
	if (printResponse) {
		// expects the stdout response from lp: 'request id is myDummyPrinter-4 (1 file(s))'
		const splitHyphen = printResponse.split("-");
		console.log(JSON.stringify(splitHyphen));
		const jobIdString = splitHyphen[1].split(" ")[0];

		try {
			const jobId = Number(jobIdString);
			return jobId;
		} catch (err) {
			return -1;
		}
	}

	return -1;
};

// sample response of running jobs of printer called "lp0": lpstat -o lp0
// Queue  Dev      Status      Job    Files      User      PP      %      Blks      CP      Rnk
// lp0    dlp0     running     39     motd       guest     10      83      12        1       1
export const isPrintComplete = async (jobId: number, printer?: string) => {
	if (jobId === -1) return false;

	const args: string[] = new Array();
	let printerToQuery = printer || (await getDefaultPrinter())?.printer || "";

	if (printerToQuery) {
		args.push("-o", printerToQuery);
	}

	const stat = await execAsync(`lpstat ${args.join(" ")}`);

	if (!stat) {
		return false;
	}

	const statLines = stat.split("\n");
	// skip the header
	for (let i = 1; i < statLines.length; i++) {
		const columns = statLines[i].split("\t");
		if (columns[0].includes(printerToQuery) && Number(columns[3]) === jobId) {
			return false; // still printing if on the queue
		}
	}

	return true;
};
