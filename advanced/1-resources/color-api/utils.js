const fs = require('fs');
const path = require('path');
const os = require('os');

const getColorFromFile = () => {
	let color = process.env.DEFAULT_COLOR;
	const filePath = process.env.COLOR_CONFIG_PATH;

	if (filePath) {
		try {
			const colorFromFile = fs.readFileSync(path.resolve(filePath), 'utf8').trim();
			color = colorFromFile;
		}
		catch (err) {
			console.error(`Error reading color from file: ${err}`);
		}
	}
	return color || 'blue';
};

const getHostname = () => {
    return os.hostname();
};

module.exports = {
    getColorFromFile,
    getHostname,
};