const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/search-poe", async (req, res) => {
    try {
        const query = req.body;
        const response = await axios.post("https://www.pathofexile.com/api/trade/search/poe2", query, {
            headers: { "Content-Type": "application/json" }
        });

        if (response.data && response.data.id) {
            res.json({ success: true, searchId: response.data.id });
        } else {
            res.status(400).json({ success: false, message: "Failed to get search ID" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));