# IBA-Praktikum – Backend-Framework

Dieses Framework bildet die Backend-Grundlage für das Praktikum im Modul **Internetbasierte Anwendungen**. Es stellt eine REST-API mit Datenbank-Anbindung und Benutzer-Authentifizierung bereit, damit ihr euch auf euer Frontend (HTML/CSS/JS, Angular, Vue) konzentrieren könnt.

**Technologien:** Node.js · Express · TypeScript · TypeORM · SQLite · JWT

---

## Schnellstart

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen einrichten

```bash
cp .env.example .env
```

Öffne `.env` und ersetze den JWT-Schlüssel durch eine sichere Zeichenkette.

### 3. Entwicklungsserver starten

```bash
npm run dev
```

Der Server läuft jetzt auf **http://localhost:3000**.  
Die SQLite-Datenbankdatei `datenbank.sqlite` wird automatisch erstellt.

---

## Projektstruktur

```
src/
├── entities/            ← Datenmodell (Datenbanktabellen)
│   ├── User.ts          ← Benutzer (für Authentifizierung, nicht verändern)
│   └── Produkt.ts       ← Beispiel-Entität mit ausführlicher Dokumentation
│
├── routes/              ← API-Endpunkte
│   ├── index.ts         ← Routen-Registry (hier neue Routen eintragen)
│   ├── auth.routes.ts   ← Login, Logout, Registrierung (nicht verändern)
│   └── produkt.routes.ts← Beispiel-CRUD-Routen für Produkte
│
├── middleware/
│   └── auth.middleware.ts ← requireAuth – schützt Routen vor nicht angemeldeten Nutzern
│
├── types/
│   └── express.d.ts     ← TypeScript-Erweiterung für req.benutzer
│
├── data-source.ts       ← Datenbankverbindung + Entitäten-Liste
└── index.ts             ← Einstiegspunkt der Anwendung
```

---

## Eigene Entität hinzufügen

### Schritt 1 – Entitätsklasse erstellen

Kopiere die Beispiel-Entität als Vorlage:

```bash
cp src/entities/Produkt.ts src/entities/Film.ts
```

Passe `Film.ts` mit deinen eigenen Feldern an:

```typescript
// src/entities/Film.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Film {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titel!: string;

  @Column('int')
  erscheinungsjahr!: number;

  @Column({ type: 'text', nullable: true })
  beschreibung!: string | null;

  @Column('decimal', { precision: 3, scale: 1 })
  bewertung!: number;

  @CreateDateColumn()
  erstelltAm!: Date;
}
```

### Schritt 2 – Entität registrieren

Öffne `src/data-source.ts` und füge deine Entität hinzu:

```typescript
// Schritt A: Import
import { Film } from './entities/Film';

// Schritt B: In der entities-Liste
entities: [
  User,
  Produkt,
  Film,  // ← neu
],
```

Die Tabelle wird beim nächsten Start **automatisch** angelegt.

### Schritt 3 – Routen erstellen

Kopiere die Beispiel-Routen:

```bash
cp src/routes/produkt.routes.ts src/routes/film.routes.ts
```

Passe die Importe und den Repository-Typ in `film.routes.ts` an:

```typescript
import { Film } from '../entities/Film';
export const filmRouter = Router();
const repo = () => AppDataSource.getRepository(Film);
```

### Schritt 4 – Routen registrieren

Öffne `src/routes/index.ts`:

```typescript
// Schritt A: Import
import { filmRouter } from './film.routes';

// Schritt B: Registrierung
app.use('/api/filme', filmRouter);
```

---

## API-Referenz

### Authentifizierung

| Methode | Endpunkt                | Beschreibung                            | Auth nötig? |
|---------|-------------------------|-----------------------------------------|-------------|
| POST    | `/api/auth/registrieren`| Neues Konto anlegen                     | Nein        |
| POST    | `/api/auth/login`       | Einloggen, JWT-Token erhalten           | Nein        |
| POST    | `/api/auth/logout`      | Ausloggen (clientseitig)                | Nein        |
| GET     | `/api/auth/profil`      | Eigenes Profil abrufen                  | **Ja**      |

#### Registrieren

```
POST /api/auth/registrieren
Content-Type: application/json

{
  "email": "max@example.com",
  "passwort": "geheim123",
  "name": "Max Muster"
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "max@example.com",
  "passwort": "geheim123"
}
```

**Antwort:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "benutzer": { "id": 1, "email": "max@example.com", "name": "Max Muster" }
}
```

Den `token` im Frontend speichern (z.B. `localStorage.setItem('token', data.token)`).

#### Geschützte Anfragen

Bei Endpunkten, die `requireAuth` erfordern, muss der Token im Header mitgeschickt werden:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**JavaScript-Beispiel:**
```javascript
const antwort = await fetch('http://localhost:3000/api/produkte', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({ name: 'Laptop', preis: 999.99 }),
});
```

---

### Beispiel-Endpunkte: Produkte

| Methode | Endpunkt             | Beschreibung              | Auth nötig? |
|---------|----------------------|---------------------------|-------------|
| GET     | `/api/produkte`      | Alle Produkte abrufen     | Nein        |
| GET     | `/api/produkte/:id`  | Ein Produkt abrufen       | Nein        |
| POST    | `/api/produkte`      | Neues Produkt anlegen     | **Ja**      |
| PUT     | `/api/produkte/:id`  | Produkt aktualisieren     | **Ja**      |
| DELETE  | `/api/produkte/:id`  | Produkt löschen           | **Ja**      |

---

## Routen schützen

Füge `requireAuth` als Middleware ein, um einen Endpunkt zu schützen:

```typescript
import { requireAuth } from '../middleware/auth.middleware';

// Nur diese Route schützen:
router.post('/', requireAuth, async (req, res) => {
  // req.benutzer enthält: { id: number, email: string }
  console.log('Anfrage von:', req.benutzer?.email);
});

// Alle Routen eines Routers schützen:
router.use(requireAuth);
```

---

## Häufige Fehlermeldungen

| HTTP-Status | Bedeutung                                  |
|-------------|--------------------------------------------|
| 400         | Ungültige Eingabe (z.B. Pflichtfeld fehlt) |
| 401         | Nicht eingeloggt oder Token abgelaufen     |
| 404         | Datensatz nicht gefunden                   |
| 409         | Konflikt (z.B. E-Mail bereits vergeben)    |
| 500         | Serverfehler (z.B. Konfigurationsproblem)  |

---

## Verfügbare TypeORM-Decorators (Kurzübersicht)

```typescript
@PrimaryGeneratedColumn()             // Auto-Increment ID
@Column()                             // Textspalte, Pflichtfeld
@Column({ type: 'text', nullable: true }) // Optionale Textspalte (type immer angeben!)
@Column({ unique: true })             // Eindeutiger Wert
@Column({ default: 'wert' })          // Standardwert
@Column('int')                        // Ganzzahl
@Column('decimal', { precision: 10, scale: 2 }) // Dezimalzahl
@Column('boolean')                    // true / false
@Column('text')                       // Langer Text
@CreateDateColumn()                   // Erstellungsdatum (automatisch)
@UpdateDateColumn()                   // Änderungsdatum (automatisch)
```

Vollständige Dokumentation: https://typeorm.io/entities
