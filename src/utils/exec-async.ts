"use strict";

import { ExecResponse } from "../types";
import { execFile } from "child_process";

export function execFileAsync(
  cmd: string,
  args: string[] = []
): Promise<ExecResponse> {
  return new Promise((resolve, reject) => {
    execFile(
      cmd,
      args,
      {
        // The output from lp and lpstat is parsed assuming the language is English.
        // LANG=C sets the language and the SOFTWARE variable is necessary
        // on MacOS due to a detail in Apple's CUPS implementation
        // (see https://unix.stackexchange.com/a/33836)
        env: {
          SOFTWARE: "",
          LANG: "C",
        },
        // shell MUST be set to false.
        // Otherwise any input containing shell metacharacters may be used to trigger arbitrary command execution.
        // See https://nodejs.org/api/child_process.html#child_processexecfilefile-args-options-callback
        shell: false,
      },
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve({ stdout, stderr });
        }
      }
    );
  });
}
