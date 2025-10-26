
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch } from 'firebase/firestore';
import config from '../src/firebase/config.ts';
const { firebaseConfig } = config;

// Data to seed
const productionStatusData = [
  { name: 'Crusher Plant 1', status: 'Optimal' },
  { name: 'Crusher Plant 2', status: 'Optimal' },
  { name: 'Washing Plant A', status: 'Warning' },
  { name: 'Barging Conveyor 1', status: 'Halted' },
];

// Get a Firestore instance
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedProductionStatus() {
  const collectionRef = collection(db, 'productionStatus');
  const batch = writeBatch(db);

  productionStatusData.forEach((data) => {
    // In a real app, you might want to use a more specific ID
    // For seeding, we can use the name as a simple ID, but this assumes names are unique.
    // Firestore will auto-generate an ID if you use addDoc, but for seeding with specific data,
    // it's often useful to control the IDs. Let's let Firestore auto-generate for simplicity here.
    const docRef = collection(db, "productionStatus"); // Let firestore create id
    // For simplicity, we are overwriting documents if they exist.
    // In a real scenario, you might want to check for existence first.
  });

  // Using setDoc with auto-generated IDs is a bit tricky.
  // Let's use addDoc within the loop, though it's less efficient than a batch write for new data.
  // For the purpose of this seed script, let's just write them one by one if a batch is complex.
  
  console.log('Seeding production status data...');

  // Let's stick to a batch write for efficiency, we can create document references without IDs first
  productionStatusData.forEach(item => {
    const docRef = collectionRef.doc(); // This doesn't work, doc() needs a path for a document.
    // The correct way is to let addDoc create the doc, or specify IDs. Let's specify IDs.
  });

  // A better approach for seeding: Use setDoc with specific IDs to make it idempotent.
  productionStatusData.forEach(item => {
    const docId = item.name.replace(/\s+/g, '-').toLowerCase();
    const docRef = collection(db, 'productionStatus').doc(docId);
    batch.set(docRef, item);
  });


  try {
    await batch.commit();
    console.log('Successfully seeded production status data.');
  } catch (error) {
    console.error('Error seeding production status data:', error);
  }
  
  // The script will exit automatically when done.
  // In Node.js, you might need to explicitly exit if there are open handles.
  // For this simple script, it should be fine.
  process.exit(0);
}

seedProductionStatus();
