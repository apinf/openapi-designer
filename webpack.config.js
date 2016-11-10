module.exports = {
    entry: "./node_modules/srl/lib/SRL.js",
    output: {
        path: __dirname,
        filename: "./srl.js",
		library: "SRL",
		libraryTarget: "var"
    }
}
