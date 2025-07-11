import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';
import { Drawing } from '../../../shared/types';

interface DrawingRow {
  id: string;
  title: string;
  strokes: string;
  author: string | null;
  created_at: string;
  updated_at: string;
}

class DatabaseService {
  private db: Database;

  constructor() {
    const dbPath = path.join(__dirname, '../../../data/drawings.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  private initializeTables(): void {
    const createDrawingsTable = `
      CREATE TABLE IF NOT EXISTS drawings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        strokes TEXT NOT NULL,
        author TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `;

    this.db.run(createDrawingsTable, (err) => {
      if (err) {
        console.error('Error creating drawings table:', err);
      } else {
        console.log('Drawings table ready');
      }
    });
  }

  public getAllDrawings(): Promise<Drawing[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM drawings ORDER BY created_at DESC', [], (err, rows: DrawingRow[]) => {
        if (err) {
          reject(err);
        } else {
          const drawings: Drawing[] = rows.map(row => ({
            id: row.id,
            title: row.title,
            strokes: JSON.parse(row.strokes),
            author: row.author || undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }));
          resolve(drawings);
        }
      });
    });
  }

  public getDrawingById(id: string): Promise<Drawing | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM drawings WHERE id = ?', [id], (err, row: DrawingRow | undefined) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          const drawing: Drawing = {
            id: row.id,
            title: row.title,
            strokes: JSON.parse(row.strokes),
            author: row.author || undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          };
          resolve(drawing);
        }
      });
    });
  }

  public createDrawing(drawing: Drawing): Promise<Drawing> {
    return new Promise((resolve, reject) => {
      const { id, title, strokes, author, createdAt, updatedAt } = drawing;
      const sql = `
        INSERT INTO drawings (id, title, strokes, author, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      this.db.run(sql, [id, title, JSON.stringify(strokes), author || null, createdAt, updatedAt], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(drawing);
        }
      });
    });
  }

  public deleteDrawing(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM drawings WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  public close(): void {
    this.db.close();
  }
}

export const dbService = new DatabaseService();