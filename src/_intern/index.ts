/**
 * =============================================================================
 * EINSTIEGSPUNKT DER ANWENDUNG  (src/index.ts)
 * =============================================================================
 *
 * Diese Datei startet den Express-Server und verbindet die Datenbank.
 * Normalerweise musst du hier nichts ändern.
 * =============================================================================
 */

import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { AppDataSource } from '../data-source';
import { registerRoutes } from '../routes';

const app = express();
const PORT = process.env.PORT ?? 3000;

// JSON-Body-Parser: Ermöglicht das Lesen von JSON in Request-Bodies
app.use(express.json());

// CORS-Header: Erlaubt Anfragen vom Frontend (z.B. Vue/Angular auf Port 5173)
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (_req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Alle API-Routen registrieren
registerRoutes(app);

// Datenbank verbinden, dann Server starten
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Datenbank verbunden');
    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
      console.log(`📖 API-Übersicht:  http://localhost:${PORT}/api`);
    });
  })
  .catch((err: unknown) => {
    console.error('❌ Fehler beim Starten der Anwendung:', err);
    process.exit(1);
  });
