const express = require('express');
const http = require('http');
const os = require('os');

const app = express();
const port = 80;
const color = "blue";
const hostname = os.hostname();

const delay_startup = process.env.DELAY_STARTUP === 'true';
const  fail_liveliness = process.env.FAIL_LIVENESS === 'true';
const fail_readiness = process.env.FAIL_READINESS === 'true' ? Math.random() < 0.5 : false;

console.log(`Delay startup: ${delay_startup}`);
console.log(`Fail liveliness: ${fail_liveliness}`);
console.log(`Fail readiness: ${fail_readiness}`);


app.get('/', (req, res) => {
	res.send(`<h1 style="color:${color}">Hello from ${hostname}:${port}</h1>`);
});


app.get('/api', (req, res) => {
	const {format} = req.query;
	if (format === 'json') {
		res.json({color, hostname, port});
	} else {
		res.send(`Color: ${color}, Hostname: ${hostname}`);
	}
});

app.get('/ready', (req, res) => {
	if (fail_readiness) {
		return res.status(503).send('Service Unavailable');
	}
	res.send('OK');
});

app.get('/up', (req, res) => {
	res.send('OK');
});

if (delay_startup) {
	console.log('Delaying startup by 60 seconds...');
	const start = Date.now();

	// Purposefully blocking the event loop for 60 seconds.
	// To simulate a startup probes.
	while (Date.now() - start < 60000) {}
	console.log('Startup delay complete.');
}

app.get('/health', (req, res) => {
	if (fail_liveliness) {
		return res.status(503).send('Service Unavailable');
	}
	res.send('OK');
});

app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});