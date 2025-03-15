app.post("/search-poe", async (req, res) => {
    try {
        const query = req.body.texts;
        console.log("Received request:", query); // Лог входных данных

        if (!query || query.length === 0) {
            return res.status(400).json({ success: false, message: "No text found" });
        }

        const filters = query.map(text => ({
            id: "explicit.stat",
            value: { option: text }
        }));

        const searchQuery = {
            query: {
                status: { option: "online" },
                stats: [{ type: "and", filters }]
            },
            sort: { price: "asc" }
        };

        console.log("Sending query to PoE API:", JSON.stringify(searchQuery, null, 2)); // Лог запроса к PoE

        const response = await axios.post("https://www.pathofexile.com/api/trade/search/poe2", searchQuery, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("PoE API Response:", response.data); // Лог ответа от PoE API

        if (response.data && response.data.id) {
            res.json({ success: true, searchId: response.data.id });
        } else {
            res.status(400).json({ success: false, message: "Search failed" });
        }
    } catch (error) {
        console.error("Error in server:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});