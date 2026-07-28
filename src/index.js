require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const chatRoutes = require("./routes/chat");
const feedbackRoutes = require("./routes/feedback");
const statsRoutes = require("./routes/stats");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", statsRoutes);

// Serve the built React app (client/dist) in production, with an SPA fallback.
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// Catches errors passed via next(err) (see asyncHandler) so a failed
// request — e.g. a DB hiccup — returns a 500 instead of crashing the process.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
