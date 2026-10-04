import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import { Project, LabEvent, CollaborationRequest, UserProfile, BitacoraEntry, HeroCarouselSlide } from '../types/flc';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use custom databaseId only if specified and not '(default)'
const customDatabaseId = import.meta.env.VITE_FIRESTORE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId;
export const db = customDatabaseId && customDatabaseId !== '(default)'
  ? getFirestore(app, customDatabaseId)
  : getFirestore(app);

// Test Firestore connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    return true;
  } catch (error: any) {
    // Expected document-not-found or permission-denied indicates server reachability
    if (error?.code !== 'unavailable') {
      return true;
    }
    console.warn('Firestore server not currently reachable:', error);
    return false;
  }
}

// Collections references
const PROJECTS_COLLECTION = 'projects';
const EVENTS_COLLECTION = 'events';
const COLLABS_COLLECTION = 'collaborations';
const USERS_COLLECTION = 'users';
const BITACORA_COLLECTION = 'bitacora';

// Seed initial data to Firestore if collection is empty
export async function seedInitialFirestoreData(
  initialProjects: Project[],
  initialEvents: LabEvent[],
  initialCollabs: CollaborationRequest[],
  initialUsers: UserProfile[],
  initialBitacora: BitacoraEntry[]
) {
  try {
    const projectsSnap = await getDocs(collection(db, PROJECTS_COLLECTION));
    if (projectsSnap.empty) {
      const batch = writeBatch(db);
      initialProjects.forEach((p) => {
        batch.set(doc(db, PROJECTS_COLLECTION, p.id), p);
      });
      initialEvents.forEach((e) => {
        batch.set(doc(db, EVENTS_COLLECTION, e.id), e);
      });
      initialCollabs.forEach((c) => {
        batch.set(doc(db, COLLABS_COLLECTION, c.id), c);
      });
      initialUsers.forEach((u) => {
        batch.set(doc(db, USERS_COLLECTION, u.id), u);
      });
      initialBitacora.forEach((b) => {
        batch.set(doc(db, BITACORA_COLLECTION, b.id), b);
      });
      await batch.commit();
      console.log('FLC Lab Firestore initialized with school initial data');
    }
  } catch (err) {
    console.warn('Could not auto-seed Firestore (using offline defaults):', err);
  }
}

// Subscriptions
export function subscribeToProjects(onUpdate: (projects: Project[]) => void) {
  return onSnapshot(
    collection(db, PROJECTS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as Project);
        onUpdate(list);
      }
    },
    (err) => console.warn('Error subscribing to projects:', err)
  );
}

export function subscribeToEvents(onUpdate: (events: LabEvent[]) => void) {
  return onSnapshot(
    collection(db, EVENTS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as LabEvent);
        onUpdate(list);
      }
    },
    (err) => console.warn('Error subscribing to events:', err)
  );
}

export function subscribeToCollaborations(onUpdate: (collabs: CollaborationRequest[]) => void) {
  return onSnapshot(
    collection(db, COLLABS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as CollaborationRequest);
        onUpdate(list);
      }
    },
    (err) => console.warn('Error subscribing to collaborations:', err)
  );
}

export function subscribeToUsers(onUpdate: (users: UserProfile[]) => void) {
  return onSnapshot(
    collection(db, USERS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as UserProfile);
        onUpdate(list);
      }
    },
    (err) => console.warn('Error subscribing to users:', err)
  );
}

export function subscribeToBitacora(onUpdate: (entries: BitacoraEntry[]) => void) {
  return onSnapshot(
    collection(db, BITACORA_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as BitacoraEntry);
        onUpdate(list);
      }
    },
    (err) => console.warn('Error subscribing to bitacora:', err)
  );
}

// Mutations
export async function saveProject(project: Project) {
  try {
    await setDoc(doc(db, PROJECTS_COLLECTION, project.id), project, { merge: true });
  } catch (err) {
    console.error('Error saving project to Firestore:', err);
  }
}

export async function deleteProjectFromDb(id: string) {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
  } catch (err) {
    console.error('Error deleting project from Firestore:', err);
  }
}

export async function saveEvent(event: LabEvent) {
  try {
    await setDoc(doc(db, EVENTS_COLLECTION, event.id), event, { merge: true });
  } catch (err) {
    console.error('Error saving event to Firestore:', err);
  }
}

export async function deleteEventFromDb(id: string) {
  try {
    await deleteDoc(doc(db, EVENTS_COLLECTION, id));
  } catch (err) {
    console.error('Error deleting event from Firestore:', err);
  }
}

export async function saveCollaboration(collab: CollaborationRequest) {
  try {
    await setDoc(doc(db, COLLABS_COLLECTION, collab.id), collab, { merge: true });
  } catch (err) {
    console.error('Error saving collab to Firestore:', err);
  }
}

export async function saveUser(user: UserProfile) {
  try {
    await setDoc(doc(db, USERS_COLLECTION, user.id), user, { merge: true });
  } catch (err) {
    console.error('Error saving user to Firestore:', err);
  }
}

export async function deleteUserFromDb(id: string) {
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, id));
  } catch (err) {
    console.error('Error deleting user from Firestore:', err);
  }
}

export async function saveBitacora(entry: BitacoraEntry) {
  try {
    await setDoc(doc(db, BITACORA_COLLECTION, entry.id), entry, { merge: true });
  } catch (err) {
    console.error('Error saving bitacora entry to Firestore:', err);
  }
}

const CAROUSEL_COLLECTION = 'carousel_slides';

export function subscribeToCarouselSlides(callback: (slides: HeroCarouselSlide[]) => void): () => void {
  const q = collection(db, CAROUSEL_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback([]);
        return;
      }
      const slides: HeroCarouselSlide[] = [];
      snapshot.forEach((d) => slides.push(d.data() as HeroCarouselSlide));
      callback(slides);
    },
    (err) => {
      console.warn('Firestore carousel_slides subscribe error:', err);
    }
  );
}

export async function saveCarouselSlide(slide: HeroCarouselSlide) {
  try {
    await setDoc(doc(db, CAROUSEL_COLLECTION, slide.id), slide, { merge: true });
  } catch (err) {
    console.error('Error saving carousel slide to Firestore:', err);
  }
}

export async function deleteCarouselSlide(id: string) {
  try {
    await deleteDoc(doc(db, CAROUSEL_COLLECTION, id));
  } catch (err) {
    console.error('Error deleting carousel slide from Firestore:', err);
  }
}
