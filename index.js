const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check for Render
app.get('/', (req, res) => {
    res.send('NexOra API Bridge is Live! 🚀');
});

// The Boosting/Music Endpoint
app.get('/generate', async (req, res) => {
    const { prompt, type } = req.query;
    if (!prompt) return res.status(400).json({ error: "No prompt provided" });

    try {
        // Placeholder for the Suno/Logo logic we will add next
        res.json({ 
            status: "success", 
            message: `Backend received ${type} request for: ${prompt}` 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
