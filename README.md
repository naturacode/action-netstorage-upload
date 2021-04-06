# Netstorage Upload Action
This is a GitHub Action for uploading a single file to Akamai Netstorage.

## Input Params
**Unless marked otherwise you will want to use GitHub Repo secrets to secure the input parameters!**
**All input parameters are required!**

* `hostname` - This is the Netstorage HTTP API you get when you create the Netstorage property group.
* `cp-code` - This is the Netstorage CP Code you get when you create the Netstorage property group.
* `key-name` - This is the id of the Netstorage upload account associated with the storage group.
* `key` - The API Key for the upload account.
* `index-zip` - This indexes a zip for use when the Upload Directory for the storage group has the Serve From Zip setting enabled. (Does not require secrets)
  * NOTE: If you have configured the directory and user to automatically index zips, then this should be set to `false`.
* `local-path` - This is the local path to the file to upload. This is going to be relative to the current working folder. (Does not require secrets)
* `destination-path` - The full upload path **WITHOUT the cp-code**, include filename.' The cp-code directory will prepended to the destination path. (Does not require secrets)

## Development Release instructions:
1. Create a branch
2. Make your changes
3. Before you commit, make sure you run `npm build` to create the dist
3. Create a PR for

## Integration Testing Hints
Sometimes you just need to step through code or see the responses from Akamai. Github Action inputs are just environment variables, but, if the variable name has a dash then life gets complicated. You can use the following to execute a bash shell with all the environment vars setup. This is all one line.

```
env 'INPUT_HOSTNAME=***' env 'INPUT_CP-CODE=***' env 'INPUT_KEY-NAME=***' env 'INPUT_KEY=***' env 'INPUT_INDEX-ZIP=false' env 'INPUT_LOCAL-PATH=build-artifact.zip' env 'INPUT_DESTINATION-PATH=/dir/build-artifact.zip' bash
```

Then inside the bash shell you can run `src/main.js`.

>**_Note:_** in the above all secrets have been masked. Additionally your INPUT_LOCAL-PATH and INPUT_DESTINATION-PATH variables should reflect the correct paths.
