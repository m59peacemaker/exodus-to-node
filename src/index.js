const fs = require('fs')
const path = require('path')
const tar = require('tar')
const glob = require('globby')
const replaceExtension = require('replace-ext')
const flat = require('array.prototype.flat')

module.exports = async ({ bundles, outputDirectoryPath }) => {
	return flat(
		await Promise.all((await glob(bundles)).map(async bundleFilePath => {
			const bundleName = replaceExtension(path.basename(bundleFilePath), '')
			const bundleOutputDirectoryPath = path.join(outputDirectoryPath, bundleName)
			await fs.promises.mkdir(bundleOutputDirectoryPath, { recursive: true })
			await tar.extract({
				file: bundleFilePath,
				cwd: bundleOutputDirectoryPath,
				strip: 1,
				keep: false
			})
			const binNames = await fs.promises.readdir(path.join(bundleOutputDirectoryPath, 'bin'))
			return Promise.all(binNames.map(async binName => {
				const relativePathToBin = path.join(bundleName, 'bin', binName)
				const jsFilePath = path.join(outputDirectoryPath, `${binName}.js`)
				await fs.promises.writeFile(
					jsFilePath,
					`module.exports = \`\${__dirname}/${relativePathToBin}\``
				)
				return { bundleFilePath, bundleName, binName, jsFilePath }
			}))
		}))
	)
}
