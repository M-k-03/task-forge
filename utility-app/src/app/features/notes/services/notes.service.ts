import { Injectable } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { STORAGE_KEYS } from '../../../core/constants/app.constants';
import { Note } from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  constructor(private storage: StorageService) {}

  getAll(): Note[] {
    const notes = this.storage.get<Note[]>(STORAGE_KEYS.NOTES) || [];
    return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  add(content: string): Note {
    const note: Note = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      content,
      createdAt: new Date().toISOString(),
    };
    const notes = this.getAll();
    notes.push(note);
    this.storage.set(STORAGE_KEYS.NOTES, notes);
    return note;
  }

  delete(id: string): void {
    const notes = this.getAll().filter((n) => n.id !== id);
    this.storage.set(STORAGE_KEYS.NOTES, notes);
  }
}
