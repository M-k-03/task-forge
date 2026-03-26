import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NotesService } from './services/notes.service';
import { Note } from './models/note.model';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header title="Notes"></app-header>

    <ion-content class="ion-padding">
      <!-- Add Note -->
      <ion-card class="add-card">
        <ion-card-content>
          <ion-item lines="none" class="input-item">
            <ion-textarea
              [(ngModel)]="newNote"
              placeholder="Write your note here..."
              rows="3"
              autoGrow="true"
            ></ion-textarea>
          </ion-item>
          <ion-button expand="block" (click)="addNote()" [disabled]="!newNote?.trim()" class="add-btn">
            <ion-icon name="add-outline" slot="start"></ion-icon>
            Save Note
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Notes List -->
      <div *ngIf="notes.length > 0; else noNotes">
        <ion-item-sliding *ngFor="let note of notes">
          <ion-item class="note-item" lines="none">
            <ion-icon name="document-text-outline" slot="start" color="success"></ion-icon>
            <ion-label class="ion-text-wrap">
              <p class="note-content">{{ note.content }}</p>
              <p class="note-date">{{ note.createdAt | date: 'MMM d, y · h:mm a' }}</p>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="deleteNote(note.id)">
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </div>

      <ng-template #noNotes>
        <div class="empty-state">
          <ion-icon name="document-text-outline" class="empty-icon"></ion-icon>
          <p>No notes yet. Write your first one!</p>
        </div>
      </ng-template>
    </ion-content>
  `,
  styles: [`
    .add-card {
      margin: 0 0 16px 0; border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: none;
    }
    .input-item {
      --background: var(--ion-color-light); --border-radius: 12px;
      margin-bottom: 10px; border-radius: 12px;
    }
    .add-btn {
      --border-radius: 12px;
      --background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      font-weight: 600; height: 48px; color: #fff;
    }
    .note-item {
      --background: var(--ion-color-light); --border-radius: 12px;
      margin-bottom: 8px; border-radius: 12px; overflow: hidden;
    }
    .note-content { font-size: 0.95rem; color: var(--ion-color-dark); white-space: pre-wrap; }
    .note-date { font-size: 0.8rem; color: var(--ion-color-medium); margin-top: 4px; }
    .empty-state { text-align: center; padding: 40px 20px; color: var(--ion-color-medium); }
    .empty-icon { font-size: 3rem; color: var(--ion-color-success-tint); opacity: 0.5; margin-bottom: 12px; }
    .empty-state p { font-size: 0.9rem; }
  `],
})
export class NotesPage {
  notes: Note[] = [];
  newNote: string = '';

  constructor(private notesService: NotesService) {}

  ionViewWillEnter(): void {
    this.loadData();
  }

  addNote(): void {
    if (!this.newNote?.trim()) return;
    this.notesService.add(this.newNote.trim());
    this.newNote = '';
    this.loadData();
  }

  deleteNote(id: string): void {
    this.notesService.delete(id);
    this.loadData();
  }

  private loadData(): void {
    this.notes = this.notesService.getAll();
  }
}
