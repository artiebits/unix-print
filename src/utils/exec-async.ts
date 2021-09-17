"use strict";

const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);

export default execAsync;
