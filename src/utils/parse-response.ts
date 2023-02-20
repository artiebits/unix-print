import {ExecResponse} from "../types";
import execAsync from "./exec-async";

const getRequestId = (printResponse: ExecResponse) => {
    const res = printResponse.stdout;
    if (res) {
        // expects the stdout response from lp: 'request id is my-Dummy-Printer-4 (1 file(s))'
        try {
            const requestId = res.split(" ")[3];

            return requestId;
        } catch (err) {
            return null;
        }
    }

    return null;
};

const splitRequestId = (requestId: string) => {
    const splitByHyphen = requestId.split("-");
    const jobId = splitByHyphen[splitByHyphen.length -1]

    const printer = requestId.slice(0, requestId.length - (jobId.length + 1)); // substring only the name and exclude the jobId + the hyphen

    return {jobId, printer}
}

// sample response of running jobs of printer called "lp0": lpstat -o lp0
// Queue  Dev      Status      Job    Files      User      PP      %      Blks      CP      Rnk
// lp0    dlp0     running     39     motd       guest     10      83      12        1       1
export const isPrintComplete = async (printResponse: ExecResponse) => {

    const requestId = getRequestId(printResponse);
    if (!requestId) return false;

    const args = new Array<string>();
    const {jobId, printer} = splitRequestId(requestId);
    if (printer) {
        args.push("-o", printer);
    }

    const stat = await execAsync(`lpstat ${args.join(" ")}`);

    if (!stat) {
        return false;
    }

    try {
        const statLines = stat.split("\n");
        // skip the header
        for (let i = 1; i < statLines.length; i++) {
            const columns = statLines[i].split("\t");

            if (columns[0].includes(printer) && columns[3] === jobId) {
                return false; // still printing if on the queue
            }
        }

        return true;
    } catch (err) {
        return true;
    }
};
