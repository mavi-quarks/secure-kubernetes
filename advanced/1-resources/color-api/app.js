const express = require('express');
const http = require('http');
const os = require('os');
const { healthRouter } = require('./routes/health');
const { controllerRouter } = require('./routes/controller');
const { getColorFromFile, getHostname } = require('./utils');
const { rootRouter } = require('./routes/root');

const app = express();
const port = 80;
const delay_startup = process.env.DELAY_STARTUP === 'true';
console.log(`Delay startup: ${delay_startup}`);

app.use('/', healthRouter);
app.use('/api', controllerRouter);
app.use('/', rootRouter);

if (delay_startup) {
	console.log('Delaying startup by 60 seconds...');
	const start = Date.now();
	// Purposefully blocking the event loop for 60 seconds.
	while (Date.now() - start < 60000) {}
	console.log('Startup delay complete.');
}

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});