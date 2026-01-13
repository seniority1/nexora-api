const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const SUNO_COOKIE = process.env.SUNO_COOKIE;

app.get('/', (req, res) => res.send('NexOra Music Engine is Live! 🎵'));

app.get('/generate', async (req, res) => {
    const { prompt } = req.query;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    try {
        // 1. Start generation
        const { data } = await axios.post('https://app.suno.ai/api/external/generate', {
            topic: prompt,
            mv: "chirp-v3.5"
        }, {
            headers: { 'Cookie': SUNO_COOKIE }
        });

        const clipId = data.clips[0].id;
        
        // 2. Return the Clip ID to the bot
        res.json({ status: "success", clipId: clipId });
    } catch (error) {
        res.status(500).json({ error: "Suno auth failed. Update your cookie." });
    }
});

// Endpoint to check if the song is ready
app.get('/check/:id', async (req, res) => {
    try {
        const { data } = await axios.get(`https://app.suno.ai/api/external/clips/?ids=${req.params.id}`, {
            headers: { 'Cookie': SUNO_COOKIE }
        });
        res.json(data[0]);
    } catch (e) {
        res.status(500).send("Error checking status");
    }
});

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
