const core = require('@actions/core');
const { existsSync } = require('fs');
const path = require('path');
const NetstorageAsync = require('./netstorage-async');

async function run() {
	try {
		// Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
		const hostname = core.getInput('hostname', { required: true });
		const cpCode = core.getInput('cp-code', { required: true });
		const keyName = core.getInput('key-name', { required: true });
		const key = core.getInput('key', { required: true });
		// I could error out if you give me BS, but that is sooo much work.
		const indexZip =
			core.getInput('index-zip') === true ||
			core.getInput('index-zip').toLowerCase() === 'true';
		const localPath = core.getInput('local-path', { required: true });
		const destinationPath = core.getInput('destination-path', {
			required: true,
		});

		if (!existsSync(localPath)) {
			throw new Error(`Path, '${localPath}' does not exist.`);
		}

		const ns = new NetstorageAsync({
			hostname,
			keyName,
			key,
			cpCode,
			ssl: true,
		});

		const netstorageDestination = path.join('/', cpCode, destinationPath);

		// An exception will be thrown if issues connecting to Akamai or if the
		// actual response is not a 200. The only thing returned is a body, which
		// would just say it worked ok.
		await ns.upload(localPath, netstorageDestination, indexZip);
	} catch (error) {
		core.setFailed(error.message);
	}
}

module.exports = run;
