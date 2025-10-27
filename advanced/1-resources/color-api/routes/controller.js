const express = require('express');
const controllerRouter = express.Router();
const { getColorFromFile, getHostname} = require('../utils');

controllerRouter.get('/', (req, res) => {
    const color = getColorFromFile();
	const hostname = getHostname();
	const {format} = req.query;
	if (format === 'json') {
		res.json({color, hostname});
	} else {
		res.send(`Color: ${color}, Hostname: ${hostname}`);
	}
});

module.exports = {
    controllerRouter,
};