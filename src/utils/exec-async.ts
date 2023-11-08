"use strict";

import { ExecResponse } from "../types";
import { exec } from "child_process";

export default function execAsync(cmd: string): Promise<ExecResponse> {
    return new Promise((resolve, reject) => {
        exec(cmd, {
            // The output from lp and lpstat is parsed assuming the language is English.
            // LANG=C sets the language and the SOFTWARE variable is necessary
            // on MacOS due to a detail in Apple's CUPS implementation
            // (see https://unix.stackexchange.com/a/33836)
            env: {
                SOFTWARE: "",
                LANG: "C"
            }
        }, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve({stdout, stderr});
            }
        });
    });
}
