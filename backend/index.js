// backend/index.js
import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure db file exists with defaults
const dbFile = path.join(__dirname, "db.json");
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(
    dbFile,
    JSON.stringify({ medicines: [], purchases: [], sales: [] }, null, 2),
    "utf8"
  );
}

// lowdb adapter with default data (prevents `missing default data` error)
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { medicines: [], purchases: [], sales: [] });
await db.read();
await db.write(); // ensures file contains defaults if it was empty

// App setup
const app = express();
app.use(cors());
app.use(express.json());

// ----- Helper utils -----
function id() {
  return nanoid(8);
}

// ----- API Routes -----

// Medicines
app.get("/api/medicines", async (req, res) => {
  await db.read();
  res.json(db.data.medicines || []);
});

app.post("/api/medicines", async (req, res) => {
  const med = { id: id(), ...req.body };
  await db.read();
  db.data.medicines.push(med);
  await db.write();
  res.json(med);
});

app.put("/api/medicines/:id", async (req, res) => {
  const { id: mid } = req.params;
  await db.read();
  const idx = (db.data.medicines || []).findIndex((m) => m.id === mid);
  if (idx === -1) return res.status(404).json({ error: "not found" });
  db.data.medicines[idx] = { ...db.data.medicines[idx], ...req.body };
  await db.write();
  res.json(db.data.medicines[idx]);
});

app.delete("/api/medicines/:id", async (req, res) => {
  const { id: mid } = req.params;
  await db.read();
  db.data.medicines = (db.data.medicines || []).filter((m) => m.id !== mid);
  await db.write();
  res.json({ ok: true });
});

// Purchases
app.get("/api/purchases", async (req, res) => {
  await db.read();
  res.json(db.data.purchases || []);
});

app.post("/api/purchases", async (req, res) => {
  const rec = { id: id(), ...req.body };
  await db.read();
  db.data.purchases.push(rec);
  // update medicine stock if medId provided
  if (rec.medId) {
    const m = (db.data.medicines || []).find((x) => x.id === rec.medId);
    if (m) m.qty = Number(m.qty || 0) + Number(rec.qty || 0);
  }
  await db.write();
  res.json(rec);
});

// Sales
app.get("/api/sales", async (req, res) => {
  await db.read();
  res.json(db.data.sales || []);
});

app.post("/api/sales", async (req, res) => {
  const rec = { id: id(), ...req.body };
  await db.read();
  db.data.sales.push(rec);
  // decrement medicine stock if medId provided
  if (rec.medId) {
    const m = (db.data.medicines || []).find((x) => x.id === rec.medId);
    if (m) m.qty = Number(m.qty || 0) - Number(rec.qty || 0);
  }
  await db.write();
  res.json(rec);
});

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Serve frontend production build if present
const distPath = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(distPath)) {
  // static serve
  app.use(express.static(distPath));
  // SPA fallback for non-API routes
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));

