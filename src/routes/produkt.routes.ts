/**
 * =============================================================================
 * BEISPIEL-ROUTEN: Produkt  (src/routes/produkt.routes.ts)
 * =============================================================================
 *
 * Diese Datei zeigt, wie du CRUD-Endpunkte für eine Entität erstellst.
 * Kopiere sie als Vorlage für deine eigenen Routen.
 *
 * Bereitgestellte Endpunkte:
 *
 *   GET    /api/produkte          → Alle Produkte abrufen (öffentlich)
 *   GET    /api/produkte/:id      → Ein Produkt abrufen (öffentlich)
 *   POST   /api/produkte          → Neues Produkt anlegen  (Login erforderlich)
 *   PUT    /api/produkte/:id      → Produkt aktualisieren  (Login erforderlich)
 *   DELETE /api/produkte/:id      → Produkt löschen        (Login erforderlich)
 *
 * ROUTEN SCHÜTZEN mit requireAuth:
 *   Füge `requireAuth` als zweites Argument ein, um eine Route zu schützen:
 *   router.post('/', requireAuth, async (req, res) => { ... });
 * =============================================================================
 */

import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Produkt } from '../entities/Produkt';
import { requireAuth } from '../middleware/auth.middleware';

export const produktRouter = Router();

// Hilfsfunktion: Gibt das TypeORM-Repository für Produkt zurück
const repo = () => AppDataSource.getRepository(Produkt);

// ── GET /api/produkte ─────────────────────────────────────────────────────────
// Gibt alle Produkte zurück.
produktRouter.get('/', async (_req: Request, res: Response) => {
  const produkte = await repo().find({
    order: { erstelltAm: 'DESC' },
  });
  res.json(produkte);
});

// ── GET /api/produkte/:id ─────────────────────────────────────────────────────
// Gibt ein einzelnes Produkt anhand seiner ID zurück.
produktRouter.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ fehler: 'Ungültige ID.' });
    return;
  }

  const produkt = await repo().findOneBy({ id });
  if (!produkt) {
    res.status(404).json({ fehler: 'Produkt nicht gefunden.' });
    return;
  }

  res.json(produkt);
});

// ── POST /api/produkte ────────────────────────────────────────────────────────
// Legt ein neues Produkt an. Erfordert einen gültigen JWT-Token.
//
// Request-Body (JSON):
//   { "name": "Laptop", "beschreibung": "...", "preis": 999.99, "lagerbestand": 5 }
produktRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  const { name, beschreibung, preis, lagerbestand, verfuegbar } = req.body as {
    name?: string;
    beschreibung?: string;
    preis?: number;
    lagerbestand?: number;
    verfuegbar?: boolean;
  };

  if (!name || preis === undefined) {
    res.status(400).json({ fehler: 'Name und Preis sind Pflichtfelder.' });
    return;
  }

  const neuesProdukt = repo().create({
    name,
    beschreibung: beschreibung ?? null,
    preis,
    lagerbestand: lagerbestand ?? 0,
    verfuegbar: verfuegbar ?? true,
  });

  await repo().save(neuesProdukt);
  res.status(201).json(neuesProdukt);
});

// ── PUT /api/produkte/:id ─────────────────────────────────────────────────────
// Aktualisiert ein vorhandenes Produkt. Erfordert einen gültigen JWT-Token.
// Es müssen nur die Felder angegeben werden, die geändert werden sollen.
produktRouter.put('/:id', requireAuth, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ fehler: 'Ungültige ID.' });
    return;
  }

  const produkt = await repo().findOneBy({ id });
  if (!produkt) {
    res.status(404).json({ fehler: 'Produkt nicht gefunden.' });
    return;
  }

  // Nur übergebene Felder überschreiben (partial update)
  repo().merge(produkt, req.body as Partial<Produkt>);
  await repo().save(produkt);

  res.json(produkt);
});

// ── DELETE /api/produkte/:id ──────────────────────────────────────────────────
// Löscht ein Produkt. Erfordert einen gültigen JWT-Token.
produktRouter.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ fehler: 'Ungültige ID.' });
    return;
  }

  const produkt = await repo().findOneBy({ id });
  if (!produkt) {
    res.status(404).json({ fehler: 'Produkt nicht gefunden.' });
    return;
  }

  await repo().remove(produkt);
  res.status(204).send();
});
