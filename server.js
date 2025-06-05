const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = "FreeFlowMusic";

app.use(cors());
app.use(express.json());

// 🎧 Obtener la URL de stream desde Audius usando el track.id (shortId o UUID)
app.get("/api/stream/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`🎯 Solicitando stream para ID: ${id}`);

  try {
    const response = await axios.get(
      `https://discoveryprovider.audius.co/v1/tracks/${id}/stream`,
      {
        params: { app_name: APP_NAME },
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
      }
    );

    const location = response.headers.location;

    if (location) {
      console.log("✅ Stream URL encontrada:", location);
      res.send(location);
    } else {
      console.warn("⚠️ No se encontró la URL de stream en headers");
      res.status(400).json({ error: "No se pudo obtener el stream URL" });
    }
  } catch (err) {
    console.error("❌ Error al pedir stream:", err.message);
    if (err.response) {
      console.error("🔍 Detalles:", err.response.status, err.response.data);
      res.status(err.response.status).json({ error: err.response.data });
    } else {
      res.status(500).json({ error: "Error interno al obtener stream" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend activo en http://localhost:${PORT}`);
});
