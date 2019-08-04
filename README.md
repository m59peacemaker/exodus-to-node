# exodus-to-node

Takes paths or globs to exodus bundles and for each binary in the bundles, outputs a js module that exports the path to the binary.

## example

package.json
```json
  "scripts": {
    "postinstall": "exodus-to-node -o 'node_modules/.bin' './exodus-bundles/*.tgz'"
  }
```

app.js
```js
const myBin = require('.bin/my-bin')

execFile(myBin, [ some, args ])
```
