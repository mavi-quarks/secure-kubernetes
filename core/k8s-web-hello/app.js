// Import the Express module
const express = require('express');

// Create an Express application
const app = express();

// Define a route for the root URL
const os = require('os');
app.get('/', (req, res) => {
	const hostname = os.hostname();
	const ip = req.socket.localAddress;
	res.send(`Version 2: Hello, world from ${hostname} (${ip})`);
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});