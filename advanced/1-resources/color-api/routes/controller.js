const express = require('express');
const controllerRouter = express.Router();
const { getHostname} = require('../utils');
const { getColor } = require('../db/color');

controllerRouter.get('/', (req, res) => {
	const {format, colorKey} = req.query;

    const color = getColor({ key: colorKey });
	const hostname = getHostname();
	
	if (format === 'json') {
		res.json({color, hostname});
	} else {
		res.send(`Color: ${color}, Hostname: ${hostname}`);
	}
});

module.exports = {
    controllerRouter,
};