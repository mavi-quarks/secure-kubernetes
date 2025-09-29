const express = require('express');

const http = require('http');

const app = express();

// Define a route for the root URL
const os = require('os');
app.get('/', (req, res) => {
	const hostname = os.hostname();
	const ip = req.socket.localAddress;
	res.send(`Version 2: Hello, world from ${hostname} (${ip})`);
});

// Connect to another service
app.get('/nginx', (req, res) => {
	const options = {
		hostname: 'nginx',
		port: 80,
		path: '/',
		method: 'GET'
	};
	const request = http.request(options, (response) => {
		let data = '';
		response.on('data', (chunk) => {
			data += chunk;
		});
		response.on('end', () => {
			res.send(`Response from Nginx service: ${data}`);
		});
	});
	request.on('error', (error) => {
		res.status(500).send(`Error connecting to Nginx service: ${error.message}`);
	});
	request.end();
});


const PORT = 3000;
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);

});