/**
 * =============================================================================
 * BENUTZER-ENTITÄT  (src/entities/User.ts)
 * =============================================================================
 *
 * Diese Entität wird für das Authentifizierungssystem benötigt.
 * Normalerweise musst du diese Datei nicht verändern.
 *
 * Die Tabelle "user" wird automatisch in der Datenbank angelegt.
 * =============================================================================
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  // Das Passwort wird als bcrypt-Hash gespeichert – niemals im Klartext!
  @Column()
  passwortHash!: string;

  @Column({ default: '' })
  name!: string;

  @CreateDateColumn()
  erstelltAm!: Date;
}
