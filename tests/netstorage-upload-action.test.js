jest.mock('@actions/core');
jest.mock('netstorageapi');
jest.mock('fs');

const fs = require('fs');
const core = require('@actions/core');
const Netstorage = require('netstorageapi');
const run = require('../src/netstorage-upload-action');

/* eslint-disable no-undef */
describe('Upload to Netstorage', () => {
	beforeEach(() => {
		// Mock things like fs, or netstorage...
		jest.restoreAllMocks();
	});

	test('Upload is run', async () => {
		core.getInput = jest
			.fn()
			.mockReturnValueOnce('hostname')
			.mockReturnValueOnce('cp-code')
			.mockReturnValueOnce('key-name')
			.mockReturnValueOnce('key')
			.mockReturnValueOnce(true)
			.mockReturnValueOnce('/foo.zip')
			.mockReturnValueOnce('/app/foo.zip');

		core.setFailed = jest.fn();

		fs.existsSync.mockReturnValueOnce(true);

		const spy = jest
			.spyOn(Netstorage.prototype, 'upload')
			.mockImplementation(
				(localSource, netstorageDestination, indexZip, callback) => {
					callback(false, { statusCode: 200 }, {});
				}
			);

		await run();

		expect(fs.existsSync).toHaveBeenCalledWith('/foo.zip');
		expect(core.setFailed).not.toHaveBeenCalled();
		expect(spy).toHaveBeenCalledWith(
			'/foo.zip',
			'/cp-code/app/foo.zip',
			true,
			expect.any(Function)
		);
		spy.mockRestore();
	});

	test('Upload is run with zip-index as string', async () => {
		core.getInput = jest
			.fn()
			.mockReturnValueOnce('hostname')
			.mockReturnValueOnce('cp-code')
			.mockReturnValueOnce('key-name')
			.mockReturnValueOnce('key')
			// If the request for zip-index is not a bool, it core.getInput will
			// be called a second time, so we need to set it twice.
			.mockReturnValueOnce('true')
			.mockReturnValueOnce('true')
			.mockReturnValueOnce('/foo.zip')
			.mockReturnValueOnce('/app/foo.zip');

		core.setFailed = jest.fn();

		fs.existsSync.mockReturnValueOnce(true);

		const spy = jest
			.spyOn(Netstorage.prototype, 'upload')
			.mockImplementation(
				(localSource, netstorageDestination, indexZip, callback) => {
					callback(false, { statusCode: 200 }, {});
				}
			);

		await run();

		expect(fs.existsSync).toHaveBeenCalledWith('/foo.zip');
		expect(core.setFailed).not.toHaveBeenCalled();
		expect(spy).toHaveBeenCalledWith(
			'/foo.zip',
			'/cp-code/app/foo.zip',
			true,
			expect.any(Function)
		);
		spy.mockRestore();
	});

	test('Upload is run with no zip-index', async () => {
		core.getInput = jest
			.fn()
			.mockReturnValueOnce('hostname')
			.mockReturnValueOnce('cp-code')
			.mockReturnValueOnce('key-name')
			.mockReturnValueOnce('key')
			// If the request for zip-index is not a bool, it core.getInput will
			// be called a second time, so we need to set it twice.
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('/foo.zip')
			.mockReturnValueOnce('/app/foo.zip');

		core.setFailed = jest.fn();

		fs.existsSync.mockReturnValueOnce(true);

		const spy = jest
			.spyOn(Netstorage.prototype, 'upload')
			.mockImplementation(
				(localSource, netstorageDestination, indexZip, callback) => {
					callback(false, { statusCode: 200 }, {});
				}
			);

		await run();

		expect(fs.existsSync).toHaveBeenCalledWith('/foo.zip');
		expect(core.setFailed).not.toHaveBeenCalled();
		expect(spy).toHaveBeenCalledWith(
			'/foo.zip',
			'/cp-code/app/foo.zip',
			false,
			expect.any(Function)
		);
		spy.mockRestore();
	});

	test('Upload handles unknown file', async () => {
		core.getInput = jest
			.fn()
			.mockReturnValueOnce('hostname')
			.mockReturnValueOnce('cp-code')
			.mockReturnValueOnce('key-name')
			.mockReturnValueOnce('key')
			.mockReturnValueOnce(true)
			.mockReturnValueOnce('/foo.zip')
			.mockReturnValueOnce('/app/foo.zip');

		core.setFailed = jest.fn();

		fs.existsSync.mockReturnValueOnce(false);

		const spy = jest
			.spyOn(Netstorage.prototype, 'upload')
			.mockImplementation(
				(localSource, netstorageDestination, indexZip, callback) => {
					callback(false, { statusCode: 200 }, {});
				}
			);

		await run();

		expect(fs.existsSync).toHaveBeenCalledWith('/foo.zip');
		expect(core.setFailed).toHaveBeenCalledWith(
			"Path, '/foo.zip' does not exist."
		);
		expect(spy).not.toHaveBeenCalled();
		spy.mockRestore();
	});

	test('Upload fails with bad status', async () => {
		core.getInput = jest
			.fn()
			.mockReturnValueOnce('hostname')
			.mockReturnValueOnce('cp-code')
			.mockReturnValueOnce('key-name')
			.mockReturnValueOnce('key')
			.mockReturnValueOnce(true)
			.mockReturnValueOnce('/foo.zip')
			.mockReturnValueOnce('/app/foo.zip');

		core.setFailed = jest.fn();

		fs.existsSync.mockReturnValueOnce(true);

		const spy = jest
			.spyOn(Netstorage.prototype, 'upload')
			.mockImplementation(
				(localSource, netstorageDestination, indexZip, callback) => {
					callback(false, { statusCode: 403 }, {});
				}
			);

		await run();

		expect(fs.existsSync).toHaveBeenCalledWith('/foo.zip');
		expect(spy).toHaveBeenCalledWith(
			'/foo.zip',
			'/cp-code/app/foo.zip',
			true,
			expect.any(Function)
		);
		expect(core.setFailed).toHaveBeenCalledWith(
			'Connected to Akamai, did not get a valid response, 403.'
		);
		spy.mockRestore();
	});

	test('Upload fails with error', async () => {
		core.getInput = jest
			.fn()
			.mockReturnValueOnce('hostname')
			.mockReturnValueOnce('cp-code')
			.mockReturnValueOnce('key-name')
			.mockReturnValueOnce('key')
			.mockReturnValueOnce(true)
			.mockReturnValueOnce('/foo.zip')
			.mockReturnValueOnce('/app/foo.zip');

		core.setFailed = jest.fn();

		fs.existsSync.mockReturnValueOnce(true);

		const spy = jest
			.spyOn(Netstorage.prototype, 'upload')
			.mockImplementation(
				(localSource, netstorageDestination, indexZip, callback) => {
					callback(new Error('Who knows what can happen'), null, null);
				}
			);

		await run();

		expect(fs.existsSync).toHaveBeenCalledWith('/foo.zip');
		expect(spy).toHaveBeenCalledWith(
			'/foo.zip',
			'/cp-code/app/foo.zip',
			true,
			expect.any(Function)
		);
		expect(core.setFailed).toHaveBeenCalledWith(
			'Error uploading, "Who knows what can happen".'
		);
		spy.mockRestore();
	});
});
