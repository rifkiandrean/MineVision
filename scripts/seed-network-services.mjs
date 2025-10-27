
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config.ts';

// --- DATA TO SEED ---
const servicesToSeed = [
  { name: 'Internet Gateway', status: 'Operational', uptime: 99.98 },
  { name: 'File Server', status: 'Operational', uptime: 99.95 },
  { name: 'Email Server', status: 'Degraded Performance', uptime: 98.5 },
  { name: 'Intranet Portal', status: 'Outage', uptime: 95.0 },
];
// --- END OF DATA ---


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedData() {
  const servicesCollection = collection(db, 'networkServices');
  const batch = writeBatch(db);

  servicesToSeed.forEach((service) => {
    // Create a new document for each service
    const docRef = doc(servicesCollection); 
    batch.set(docRef, service);
  });

  try {
    await batch.commit();
    console.log(`Successfully seeded ${servicesToSeed.length} network services.`);
  } catch (error) {
    console.error('Error seeding network services:', error);
  }
}

seedData().then(() => {
  // The process will exit automatically.
});
