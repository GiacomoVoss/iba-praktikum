/**
 * Erweitert das Express-Request-Objekt um das `benutzer`-Feld.
 * Dieses wird von der Auth-Middleware befüllt, nachdem ein JWT erfolgreich
 * verifiziert wurde.
 */
declare namespace Express {
  interface Request {
    benutzer?: {
      id: number;
      email: string;
    };
  }
}
