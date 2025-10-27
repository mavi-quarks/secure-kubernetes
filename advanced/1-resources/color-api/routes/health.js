const express = require('express');
const healthRouter = express.Router();

const  fail_liveliness = process.env.FAIL_LIVENESS === 'true';
const fail_readiness = process.env.FAIL_READINESS === 'true' ? Math.random() < 0.5 : false;

console.log(`Fail liveliness: ${fail_liveliness}`);
console.log(`Fail readiness: ${fail_readiness}`);

healthRouter.get('/ready', (req, res) => {
	if (fail_readiness) {
		return res.status(503).send('Service Unavailable');
	}
	res.send('OK');
});

healthRouter.get('/up', (req, res) => {
	res.send('OK');
});


healthRouter.get('/health', (req, res) => {
	if (fail_liveliness) {
		return res.status(503).send('Service Unavailable');
	}
	res.send('OK');
});

module.exports = {
    healthRouter,
};