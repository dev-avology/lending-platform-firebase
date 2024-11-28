/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from './firebase';
import { doc, setDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch, getDocs, collection, query, where, getDoc, WhereFilterOp, CollectionReference, DocumentData, Query } from 'firebase/firestore';

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
      let collectionQuery: Query<DocumentData> = collectionRef;

      // Apply conditions if provided
      if (conditions) {
        const filters = conditions.map(([field, op, value]) => where(field, op, value));
        collectionQuery = query(collectionRef, ...filters);
      }

      const querySnapshot = await getDocs(collectionQuery);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return data;
    } catch (error) {
      console.error('Error fetching collection:', error);
      throw new Error('Error fetching collection');
    }
  },

  /**
   * Fetch a single document from a Firestore collection by ID.
   * @param collectionPath - Path to the Firestore collection.
   * @param docId - Document ID to fetch.
   * @returns The document data or null if not found.
   */
  getRecord: async (collectionPath: string, docId: string) => {
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
  create: async (collectionPath: string, data: Record<string, any>) => {
    try {
      const docRef = await setDoc(doc(db, collectionPath), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef;
    } catch (error) {
      console.log('Error creating document:', error);
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
  update: async (collectionPath: string, docId: string, data: Record<string, any>) => {
    try {
      const docRef = doc(db, collectionPath, docId);
      await updateDoc(docRef, data);
      return docRef;
    } catch (error) {
      console.log('Error updating document:', error);
      throw new Error('Error updating document');
    }
  },

  /**
   * Delete a document from a Firestore collection.
   * @param collectionPath - Path to the Firestore collection.
   * @param docId - Document ID to delete.
   * @returns A promise indicating the result of the deletion.
   */
  delete: async (collectionPath: string, docId: string) => {
    try {
      const docRef = doc(db, collectionPath, docId);
      await deleteDoc(docRef);
      console.log(`Document with ID ${docId} deleted successfully`);
    } catch (error) {
      console.log('Error deleting document:', error);
      throw new Error('Error deleting document');
    }
  },

    /**
   * Bulk create documents in a Firestore collection using batch operations.
   * @param collectionPath - Path to the Firestore collection.
   * @param data - Array of data to insert.
   * @returns A promise that resolves when the batch is committed.
   */
    bulkCreate: async (collectionPath: string, data: Record<string, any>[]) => {
        try {
          const batch = writeBatch(db);
    
          for (const item of data) {
            // Query Firestore to check if a document with the same account_id exists
            const accountQuery = query(
              collection(db, collectionPath),
              where('persistent_id', '==', item.persistent_id)
            );
            const querySnapshot = await getDocs(accountQuery);
    
            // Only add the document if no existing document is found
            if (querySnapshot.empty) {
              const docRef = doc(
                db,
                collectionPath,
                `${item.id}` // Optionally, use a custom ID generator
              );
              batch.set(docRef, {
                ...item,
                createdAt: serverTimestamp(),
              });
            } else {
              console.log(`Skipping document for account_id: ${item.account_id}, already exists.`);
            }
          }
    
          // Commit the batch
          await batch.commit();
          console.log(`${data.length} documents processed in ${collectionPath}`);
        } catch (error) {
          console.error('Error in bulk create:', error);
          throw new Error('Error creating documents in bulk');
        }
      },
};
