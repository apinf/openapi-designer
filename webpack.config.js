module.exports = {
    entry: "./node_modules/srl/lib/SRL.js",
    output: {
        path: __dirname,
        filename: "./node_modules/srl/dist/srl.js",
		library: "SRL",
		libraryTarget: "var"
    }
};
