/**
 * =============================================================================
 * ROUTEN-REGISTRY  (src/routes/index.ts)
 * =============================================================================
 *
 * Hier werden alle Routen-Module importiert und bei der Express-App registriert.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  SO FÜGST DU NEUE ROUTEN HINZU                                          │
 * │                                                                         │
 * │  1. Erstelle die Datei:  src/routes/meineentitaet.routes.ts             │
 * │     (Orientiere dich an src/routes/produkt.routes.ts als Vorlage)       │
 * │                                                                         │
 * │  2. Importiere den Router hier (Schritt A)                              │
 * │                                                                         │
 * │  3. Registriere ihn mit app.use() (Schritt B)                           │
 * └─────────────────────────────────────────────────────────────────────────┘
 * =============================================================================
 */

import { Express, Request, Response } from 'express';
import { authRouter } from './auth.routes';

// ── Schritt A: Importiere hier deine eigenen Router ───────────────────────────
import { produktRouter } from './produkt.routes';
// import { meineEntitaetRouter } from './meineentitaet.routes';
// ──────────────────────────────────────────────────────────────────────────────

export function registerRoutes(app: Express): void {
  // Übersichtsseite
  app.get('/api', (_req: Request, res: Response) => {
    res.json({
      nachricht: 'IBA-Praktikum API läuft!',
      endpunkte: {
        auth: '/api/auth',
        produkte: '/api/produkte',
        // Hier eigene Endpunkte eintragen:
      },
    });
  });

  // Eingebaute Routen (nicht verändern)
  app.use('/api/auth', authRouter);

  // ── Schritt B: Registriere deine eigenen Router hier ────────────────────────
  app.use('/api/produkte', produktRouter);
  // app.use('/api/meineentitaet', meineEntitaetRouter);
  // ────────────────────────────────────────────────────────────────────────────

  // 404-Handler für unbekannte Routen
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ fehler: 'Endpunkt nicht gefunden.' });
  });
}
