const Netstorage = require('netstorageapi');

class NetstorageAsync {
	/**
	 * Creates a new instance of a NetstorageAsync class.
	 *
	 * @param {Object} netstorageOpts
	 * 	 The options for netstorage.
	 */
	constructor(netstorageOpts) {
		this.nsClient = new Netstorage(netstorageOpts);
	}

	/**
	 * Asynchronous method to wrap the netstorage upload.
	 *
	 * @param {string} localSource
	 *   The local path to the file to upload.
	 * @param {string} netstorageDestination
	 *   The remote path to upload to.
	 * @param {Boolean} indexZip
	 *   True to indicate that the zip should be indexed. NOTE: The storage needs
	 *   to be configured for zip indexing.
	 */
	async upload(localSource, netstorageDestination, indexZip = false) {
		return new Promise((resolve, reject) => {
			// Check that the file does indeed exist cause
			this.nsClient.upload(
				localSource,
				netstorageDestination,
				indexZip,
				(error, response, body) => {
					if (error) {
						// errors other than http response codes
						reject(new Error(`Error uploading, "${error.message}".`));
					}
					if (response.statusCode === 200) {
						resolve(body);
					} else {
						reject(
							new Error(
								`Connected to Akamai, did not get a valid response, ${response.statusCode}.`
							)
						);
					}
				}
			);
		});
	}
}

module.exports = NetstorageAsync;
