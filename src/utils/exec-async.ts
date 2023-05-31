"use strict";

const { exec } = require("child_process");
const util = require("util");
const execAsync: (command: string) => Promise<any> = util.promisify(exec);

export default execAsync;
