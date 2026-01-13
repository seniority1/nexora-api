const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// This will extract the __session part from your long SUNO_COOKIE
const getAuthToken = () => {
    const cookie = process.env.SUNO_COOKIE;
    if (!cookie) return null;
    const match = cookie.match(/__session=([^;]+)/);
    return match ? match[1] : null;
};

app.get('/', (req, res) => res.send('NexOra Music Engine is Live! 🎵'));

app.get('/generate', async (req, res) => {
    const { prompt } = req.query;
    const token = getAuthToken();

    if (!prompt) return res.status(400).json({ error: "Missing prompt" });
    if (!token) return res.status(500).json({ error: "Cookie not found in Environment Variables" });

    try {
        // New Suno Studio API Endpoint
        const response = await axios.post('https://studio-api.suno.ai/api/external/generate/', {
            prompt: prompt,
            make_instrumental: false,
            mv: "chirp-v3-5"
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'text/plain;charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });

        // Suno returns an array of clips
        const clipId = response.data.clips[0].id;
        res.json({ status: "success", clipId: clipId });

    } catch (error) {
        console.error("Suno API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Suno rejected the request. Check if cookie is fresh." });
    }
});

app.get('/check/:id', async (req, res) => {
    const token = getAuthToken();
    try {
        const { data } = await axios.get(`https://studio-api.suno.ai/api/external/clips/?ids=${req.params.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        // Returns the first clip found
        res.json(data[0]);
    } catch (e) {
        res.status(500).json({ error: "Error checking status" });
    }
});

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
