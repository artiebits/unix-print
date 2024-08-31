import { ExecResponse } from "../types";
import { execFileAsync } from "./exec-async";

async function isPrintComplete(printResponse: ExecResponse) {
  const requestId = getRequestId(printResponse);
  if (!requestId) {
    return false;
  }

  const args: string[] = [];
  const { printer } = splitRequestId(requestId);
  if (printer) {
    args.push("-o", printer);
  }

  const { stdout } = await execFileAsync("lpstat", args);

  if (!stdout) {
    return true;
  }

  try {
    const lines = stdout.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(requestId)) {
        return false; // still printing if on the queue
      }
    }

    return true;
  } catch (err) {
    return true;
  }
}

export function getRequestId(printResponse: ExecResponse) {
  const res = printResponse.stdout;
  if (res) {
    try {
      const requestId = res.split(" ")[3];

      return printerNameRegex.test(requestId) ? requestId : null;
    } catch (err) {
      return null;
    }
  }

  return null;
}

function splitRequestId(requestId: string) {
  const splitByHyphen = requestId.split("-");
  const jobId = splitByHyphen[splitByHyphen.length - 1];

  const printer = requestId.slice(0, requestId.length - (jobId.length + 1)); // substring only the name and exclude the jobId + the hyphen

  return { jobId, printer };
}

const printerNameRegex = /^[\w\.\/_@.\/@#$&+-]+-[0-9]+$/;

export default isPrintComplete;
