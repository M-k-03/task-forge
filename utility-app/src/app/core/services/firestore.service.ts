import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  setDoc,
  DocumentData,
  CollectionReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

/**
 * Generic Firestore Service for generic CRUD operations.
 * Separates Data access from business logic as per Data Agent standards.
 */
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);

  /**
   * Get a collection's data as a reactive stream.
   * @param path Collection path
   */
  getCollection<T>(path: string): Observable<T[]> {
    const colRef = collection(this.firestore, path) as CollectionReference<T>;
    return collectionData(colRef, { idField: 'id' as any }) as Observable<T[]>;
  }

  /**
   * Add a new document to a collection.
   * @param path Collection path
   * @param data Document data
   */
  async addDocument<T extends DocumentData>(path: string, data: T): Promise<string> {
    const colRef = collection(this.firestore, path);
    const docRef = await addDoc(colRef, this.cleanObject(data));
    return docRef.id;
  }

  /**
   * Set a document with a specific ID (Create or Overwrite).
   * @param path Collection path
   * @param id Document ID
   * @param data Document data
   */
  async setDocument<T extends DocumentData>(path: string, id: string, data: T): Promise<void> {
    const docRef = doc(this.firestore, path, id);
    return setDoc(docRef, this.cleanObject(data));
  }

  /**
   * Update fields of an existing document.
   * @param path Collection path
   * @param id Document ID
   * @param data Partial document data
   */
  async updateDocument<T extends DocumentData>(path: string, id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.firestore, path, id);
    return updateDoc(docRef, this.cleanObject(data as any));
  }

  /**
   * Delete a document by ID.
   * @param path Collection path
   * @param id Document ID
   */
  async deleteDocument(path: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, path, id);
    return deleteDoc(docRef);
  }

  /**
   * Removes undefined properties from an object for Firestore compatibility.
   */
  private cleanObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanObject(item));
    }

    const clean: any = {};
    Object.keys(obj).forEach(key => {
      const val = obj[key];
      if (val !== undefined) {
        clean[key] = this.cleanObject(val);
      }
    });
    return clean;
  }
}
