import express from "express";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  
  // Hostinger and other cloud providers pass the port in process.env.PORT
  const PORT = Number(process.env.PORT || 3000);

  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(distPath);

  // Serve static files if '/dist' folder is found (production / compiled state)
  if (hasDist && process.env.NODE_ENV !== "development") {
    console.log("Serving production files from:", distPath);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.log("Starting Vite development middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
