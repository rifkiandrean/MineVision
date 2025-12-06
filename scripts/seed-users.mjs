
// This script is for one-time use to seed the initial super admin user.
// It's not intended for regular use.

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config.js'; // Use .js extension for Node ESM

// --- User Credentials ---
const newUser = {
    email: 'rifkiandrean@gmail.com',
    password: '12345678', // Use a strong, secure password in a real environment
    department: 'Super Admin',
};

// --- Firebase Initialization ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

async function seedUser() {
    console.log(`Attempting to create user: ${newUser.email}`);

    try {
        // 1. Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
        const user = userCredential.user;
        console.log(`Successfully created user in Firebase Auth with UID: ${user.uid}`);

        // 2. Create user document in Firestore 'users' collection
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            department: newUser.department,
        });
        console.log(`Successfully created user document in Firestore for UID: ${user.uid}`);
        
        // 3. Set default permissions for the new user
        const permissionsDocRef = doc(firestore, 'userPermissions', user.uid);
        const allPermissions = [ 'dashboard', 'produksi', 'geologi', 'pengolahan', 'k3l', 'keuangan', 'sdm', 'it', 'pengaturan', 'keuangan_approval', 'sdm_approval' ];
        const permissions = {};
        allPermissions.forEach(p => {
            permissions[p] = true; // Grant all permissions to Super Admin
        });

        await setDoc(permissionsDocRef, {
            userId: user.uid,
            permissions,
        });
        console.log(`Successfully set full permissions for Super Admin.`);


        console.log('\nSeed process completed successfully!');
        process.exit(0);

    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.error(`\nError: User with email ${newUser.email} already exists.`);
            console.log('Skipping user creation.');
            process.exit(0);
        } else {
            console.error('\nAn unexpected error occurred:');
            console.error(error);
            process.exit(1);
        }
    }
}

seedUser();
