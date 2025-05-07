const express = require('express');
const fetch = require('node-fetch'); // make sure you're using node-fetch v2
const cors = require('cors');

const app = express();
app.use(cors());
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

        console.log('✅ Upstream API response:', data);

        if (!upstreamResponse.ok) {
            console.error('❌ Upstream error response:', data);
            return res.status(upstreamResponse.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error('❌ Proxy caught error:', error);
        res.status(500).json({ error: error.message || 'Proxy server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
});
