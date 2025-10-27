const express = require('express');
const rootRouter = express.Router();
const { getColorFromFile, getHostname} = require('../utils');

rootRouter.get('/', (req, res) => {
    const color = getColorFromFile();
    const hostname = getHostname();
    res.send(`<h1 style="color:${color}">Hello from color-api!</h1> <h2>Hostname: ${hostname}</h2>`);
});

module.exports = {
    rootRouter,
};