/**
 * =============================================================================
 * AUTHENTIFIZIERUNGS-ROUTEN  (src/routes/auth.routes.ts)
 * =============================================================================
 *
 * Bereitgestellte Endpunkte:
 *
 *   POST /api/auth/registrieren   → Neues Konto anlegen
 *   POST /api/auth/login          → Einloggen, JWT-Token erhalten
 *   POST /api/auth/logout         → Ausloggen (clientseitig)
 *   GET  /api/auth/profil         → Eigenes Profil abrufen (Login erforderlich)
 *
 * Normalerweise musst du diese Datei nicht verändern.
 * =============================================================================
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { requireAuth } from '../middleware/auth.middleware';

export const authRouter = Router();

const userRepository = () => AppDataSource.getRepository(User);

// ── POST /api/auth/registrieren ───────────────────────────────────────────────
// Legt ein neues Benutzerkonto an.
//
// Request-Body (JSON):
//   { "email": "max@example.com", "passwort": "geheim123", "name": "Max Muster" }
//
// Response (201 Created):
//   { "nachricht": "Konto erfolgreich erstellt.", "benutzer": { "id": 1, ... } }
authRouter.post('/registrieren', async (req: Request, res: Response) => {
  const { email, passwort, name } = req.body as {
    email?: string;
    passwort?: string;
    name?: string;
  };

  if (!email || !passwort) {
    res.status(400).json({ fehler: 'E-Mail und Passwort sind Pflichtfelder.' });
    return;
  }

  if (passwort.length < 6) {
    res.status(400).json({ fehler: 'Das Passwort muss mindestens 6 Zeichen lang sein.' });
    return;
  }

  const vorhanden = await userRepository().findOneBy({ email });
  if (vorhanden) {
    res.status(409).json({ fehler: 'Diese E-Mail-Adresse ist bereits registriert.' });
    return;
  }

  // Passwort hashen (Kostenfaktor 12 ist ein guter Standard)
  const passwortHash = await bcrypt.hash(passwort, 12);

  const neuerUser = userRepository().create({ email, passwortHash, name: name ?? '' });
  await userRepository().save(neuerUser);

  res.status(201).json({
    nachricht: 'Konto erfolgreich erstellt.',
    benutzer: { id: neuerUser.id, email: neuerUser.email, name: neuerUser.name },
  });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
// Überprüft E-Mail und Passwort, gibt bei Erfolg einen JWT-Token zurück.
//
// Request-Body (JSON):
//   { "email": "max@example.com", "passwort": "geheim123" }
//
// Response (200 OK):
//   { "token": "eyJhbGci...", "benutzer": { "id": 1, "email": "...", "name": "..." } }
//
// Der Token muss vom Client gespeichert werden (z.B. im localStorage).
// Bei zukünftigen Anfragen wird er im Authorization-Header mitgeschickt:
//   Authorization: Bearer eyJhbGci...
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, passwort } = req.body as { email?: string; passwort?: string };

  if (!email || !passwort) {
    res.status(400).json({ fehler: 'E-Mail und Passwort sind Pflichtfelder.' });
    return;
  }

  const user = await userRepository().findOneBy({ email });
  if (!user) {
    // Absichtlich vage Fehlermeldung (verhindert E-Mail-Enumeration)
    res.status(401).json({ fehler: 'E-Mail oder Passwort falsch.' });
    return;
  }

  const passwortKorrekt = await bcrypt.compare(passwort, user.passwortHash);
  if (!passwortKorrekt) {
    res.status(401).json({ fehler: 'E-Mail oder Passwort falsch.' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ fehler: 'JWT_SECRET nicht konfiguriert.' });
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as jwt.SignOptions,
  );

  res.json({
    token,
    benutzer: { id: user.id, email: user.email, name: user.name },
  });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
// Da JWT zustandslos ist, reicht es, den Token auf dem Client zu löschen.
// Dieser Endpunkt signalisiert dem Frontend, dass der Logout erfolgreich war.
//
// Hinweis: Für echte Token-Invalidierung wäre eine Denylist in der Datenbank
// nötig – das geht über den Rahmen dieses Frameworks hinaus.
authRouter.post('/logout', (_req: Request, res: Response) => {
  res.json({ nachricht: 'Erfolgreich ausgeloggt. Bitte den Token clientseitig löschen.' });
});

// ── GET /api/auth/profil ──────────────────────────────────────────────────────
// Gibt die Daten des aktuell eingeloggten Benutzers zurück.
// Erfordert einen gültigen JWT-Token (requireAuth).
//
// Response (200 OK):
//   { "id": 1, "email": "max@example.com", "name": "Max Muster", "erstelltAm": "..." }
authRouter.get('/profil', requireAuth, async (req: Request, res: Response) => {
  const user = await userRepository().findOneBy({ id: req.benutzer!.id });
  if (!user) {
    res.status(404).json({ fehler: 'Benutzer nicht gefunden.' });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    erstelltAm: user.erstelltAm,
  });
});
