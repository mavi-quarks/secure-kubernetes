const express = require('express');
const rootRouter = express.Router();
const { getHostname} = require('../utils');
const { getColor } = require('../db/color');

rootRouter.get('/', (req, res) => {
	const {colorKey} = req.query;

    console.log('colorKey:', colorKey);
    const color = getColor({ key: colorKey });
    const hostname = getHostname();
    res.send(`<h1 style="color:${color}">Hello from color-api!</h1> <h2>Hostname: ${hostname}</h2>`);
});

module.exports = {
    rootRouter,
};