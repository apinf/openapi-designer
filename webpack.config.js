module.exports = {
    entry: "./node_modules/srl/lib/SRL.js",
    output: {
        path: __dirname,
        filename: "./lib/srl.js",
		library: "SRL",
		libraryTarget: "var"
    }
}
