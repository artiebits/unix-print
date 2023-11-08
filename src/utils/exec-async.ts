"use strict";

import { ExecResponse } from "../types";
import { exec } from "child_process";

export default function execAsync(cmd: string): Promise<ExecResponse> {
    return new Promise((resolve, reject) => {
        exec(cmd, {
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
