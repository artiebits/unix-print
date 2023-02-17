"use strict";

const {exec} = require("child_process");
const util = require("util");
const _execAsync = util.promisify(exec);

/**
 * https://stackoverflow.com/questions/47629756/how-can-i-get-the-returned-value-from-the-child-process-exec-in-javascript
 * Date: 2023, Feb 17
 */
const execAsync = async (command: string) => {
	let result;
	try {
		result = await _execAsync(command);
	} catch (ex) {
		return "";
	}
	if (Error[Symbol.hasInstance](result)) {
		return "";
	}
	return result;
};

export default execAsync;
