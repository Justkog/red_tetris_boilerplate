var path = require('path');

module.exports = {
	entry: ['./src/client/index.js'],

	devServer: {
		disableHostCheck: true,
		historyApiFallback: true,
	},

	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.js',
		publicPath: '/',
	},

	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query:{
					presets: ["es2015", "react", "stage-0"]
				}
			},
			{ test: /\.css$/, loaders: ["style", "css"] },
		]
	},

	watchOptions: {
		aggregateTimeout: 300,
		poll: 5000,
		ignored: [
			path.resolve(__dirname, 'dist'),
			path.resolve(__dirname, 'node_modules'),
		  ]
	}
};
