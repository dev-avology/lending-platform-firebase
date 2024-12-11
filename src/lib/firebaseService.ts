/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from './firebase';
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  getDocs,
  collection,
  query,
  where,
  getDoc,
  CollectionReference,
  DocumentData,
  Query,
  WhereFilterOp,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Firebase Firestore service for handling CRUD operations
 */
export const firebaseService = {
  /**
   * Fetch all documents from a Firestore collection.
   * @param collectionPath - Path to the Firestore collection.
   * @param conditions - Optional conditions to filter the query.
   * @returns An array of documents.
   */
  getCollection: async (
    collectionPath: string,
    conditions?: Array<[string, WhereFilterOp, any]>
  ): Promise<any[]> => {
    try {
      const collectionRef: CollectionReference<DocumentData> = collection(db, collectionPath);
      const filters = conditions?.map(([field, op, value]) => where(field, op, value)) || [];
      const collectionQuery: Query<DocumentData> = filters.length
        ? query(collectionRef, ...filters)
        : collectionRef;

      const querySnapshot = await getDocs(collectionQuery);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching collection:', error);
      throw new Error('Error fetching collection');
    }
  },

  /**
   * Fetch a single document from a Firestore collection based on conditions.
   * @param collectionPath - Path to the Firestore collection.
   * @param conditions - Array of conditions [field, operator, value].
   * @returns The document data or null if no document matches.
   */
  getRecordByCondition: async (
    collectionPath: string,
    conditions: Array<[string, WhereFilterOp, any]>
  ): Promise<any | null> => {
    try {
      const collectionRef = collection(db, collectionPath);
      const queryRef = conditions.reduce(
        (q, [field, operator, value]) => query(q, where(field, operator, value)),
        query(collectionRef)
      );

      const querySnapshot = await getDocs(queryRef);

      if (querySnapshot.empty) {
        console.log(`No document matches the conditions in ${collectionPath}`);
        return null;
      }

      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error fetching record:', error);
      throw new Error('Error fetching record based on conditions');
    }
  },

  /**
   * Fetch a single document from a Firestore collection by ID.
   * @param collectionPath - Path to the Firestore collection.
   * @param docId - Document ID to fetch.
   * @returns The document data or null if not found.
   */
  getRecord: async (collectionPath: string, docId: string): Promise<any | null> => {
    try {
      const docRef = doc(db, collectionPath, docId);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        console.log(`Document with ID ${docId} does not exist.`);
        return null;
      }

      return { id: docSnapshot.id, ...docSnapshot.data() };
    } catch (error) {
      console.error('Error fetching record:', error);
      throw new Error('Error fetching record');
    }
  },

  /**
   * Create a new document in a Firestore collection.
   * @param collectionPath - Path to the Firestore collection.
   * @param data - The data to store in the document.
   * @returns The created document reference.
   */
  create: async (collectionPath: string, data: Record<string, any>): Promise<void> => {
    try {
      const docId = uuidv4();
      await setDoc(doc(db, collectionPath, docId), {
        ...data,
        createdAt: serverTimestamp(),
      });
      console.log('Document created with ID:', docId);
    } catch (error) {
      console.error('Error creating document:', error);
      throw new Error('Error creating document');
    }
  },

  /**
   * Update an existing document in Firestore.
   * @param collectionPath - Path to the Firestore collection.
   * @param docId - Document ID to update.
   * @param data - The data to update in the document.
   * @returns The updated document reference.
   */
  update: async (collectionPath: string, docId: string, data: Record<string, any>): Promise<void> => {
    try {
      const docRef = doc(db, collectionPath, docId);
      await updateDoc(docRef, data);
      console.log('Document updated:', docId);
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error('Error updating document');
    }
  },

  /**
   * Delete a document from a Firestore collection.
   * @param collectionPath - Path to the Firestore collection.
   * @param docId - Document ID to delete.
   * @returns A promise indicating the result of the deletion.
   */
  delete: async (collectionPath: string, docId: string): Promise<void> => {
    try {
      const docRef = doc(db, collectionPath, docId);
      await deleteDoc(docRef);
      console.log(`Document with ID ${docId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Error deleting document');
    }
  },

  /**
   * Bulk create documents in a Firestore collection using batch operations.
   * @param collectionPath - Path to the Firestore collection.
   * @param data - Array of data to insert.
   * @param conditionField - Field to check for uniqueness.
   * @returns A promise that resolves when the batch is committed.
   */
  bulkCreate: async (
    collectionPath: string,
    data: Record<string, any>[],
    conditionField?: string
  ): Promise<void> => {
    if (!data.length) {
      console.log('No data to process.');
      return;
    }

    try {
      const batch = writeBatch(db);

      for (const item of data) {
        let shouldAdd = true;

        if (conditionField) {
          const querySnapshot = await getDocs(
            query(collection(db, collectionPath), where(conditionField, '==', item[conditionField]))
          );
          shouldAdd = querySnapshot.empty;
        }

        if (shouldAdd) {
          const docRef = doc(db, collectionPath, item.id || uuidv4());
          batch.set(docRef, { ...item, createdAt: serverTimestamp() });
        } else {
          console.log(
            `Skipping document with ${conditionField}:already exists.`
          );
        }
      }

      await batch.commit();
      console.log(`Processed ${data.length} documents in collection: ${collectionPath}`);
    } catch (error) {
      console.error('Error in bulkCreate:', error);
      throw new Error('Failed to create documents in bulk');
    }
  },

/**
 * Uploads a file to Firebase Storage and retrieves its download URL.
 * @param fileBytes - The file data as Uint8Array or ArrayBuffer.
 * @param fileName - The name of the file to be uploaded (including path).
 * @returns A Promise that resolves to the download URL of the uploaded file.
 */
 uploadToFirebaseStorage: async (storagePath: string, fileBytes: Uint8Array | ArrayBuffer): Promise<string> => {

  const storage = getStorage(); // Initialize Firebase Storage
  const fileRef = ref(storage, storagePath); // Reference to the file path in storage

  try {
      // Upload the file bytes with a specified content type
      await uploadBytes(fileRef, fileBytes, { contentType: 'application/pdf' });
      console.log("File uploaded successfully!");

      // Get and return the download URL of the uploaded file
      return await getDownloadURL(fileRef);
  } catch (error) {
      console.error("Error uploading file to Firebase:", error);
      throw error; // Re-throw the error to be handled by the caller
  }
},
};
