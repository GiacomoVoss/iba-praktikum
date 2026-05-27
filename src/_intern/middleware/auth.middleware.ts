/**
 * =============================================================================
 * AUTHENTIFIZIERUNGS-MIDDLEWARE  (src/middleware/auth.middleware.ts)
 * =============================================================================
 *
 * Diese Middleware schützt Routen, die eine Anmeldung erfordern.
 *
 * VERWENDUNG in einer Route:
 *
 *   import { requireAuth } from '../middleware/auth.middleware';
 *
 *   // Einzelne Route schützen:
 *   router.post('/neu', requireAuth, (req, res) => {
 *     // req.benutzer enthält die Daten des angemeldeten Nutzers
 *     console.log(req.benutzer); // { id: 1, email: 'max@example.com' }
 *   });
 *
 *   // Alle Routen eines Routers schützen:
 *   router.use(requireAuth);
 *
 * WIE ES FUNKTIONIERT:
 *   1. Der Client sendet den Token im Authorization-Header:
 *      Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *   2. Die Middleware extrahiert und verifiziert den Token.
 *   3. Bei Erfolg werden die Benutzerdaten in `req.benutzer` gespeichert.
 *   4. Bei einem ungültigen Token wird HTTP 401 zurückgegeben.
 * =============================================================================
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  // Prüfe, ob ein Authorization-Header vorhanden ist
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ fehler: 'Kein Token angegeben. Bitte zuerst einloggen.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({ fehler: 'JWT_SECRET nicht konfiguriert.' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.benutzer = { id: payload.id, email: payload.email };
    next();
  } catch {
    res.status(401).json({ fehler: 'Token ungültig oder abgelaufen.' });
  }
}
