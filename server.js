const express = require('express');
const fetch = require('node-fetch'); // use node-fetch@2
const cors = require('cors');

const app = express();

// ✅ CORS Configuration
const corsOptions = {
    origin: 'https://jtpendle10.github.io',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ Handle preflight OPTIONS requests

app.use(express.json());

const API_URL = 'https://demo.api.staging.ndustrial.io/graphql';
const FALLBACK_API_TOKEN = 'token niou_7ArRm0eaS7CnoJFTu1rNTOUi9mzGaehFvxIM';

app.post('/proxy', async (req, res) => {
    try {
        console.log('🚀 Incoming request body:', req.body);
        console.log('🚀 Incoming headers:', req.headers);

        const authHeader = req.headers['authorization'] || FALLBACK_API_TOKEN;

        const upstreamResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(req.body)
        });

        const data = await upstreamResponse.json();

        console.log('✅ Upstream API res
