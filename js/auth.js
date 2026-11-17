import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';

let authInstance = null;
let googleProvider = null;

export async function initFirebaseAuth(onUserChange) {
  const response = await fetch('/firebase-applet-config.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Gagal memuat konfigurasi Firebase.');
  }
  const firebaseConfig = await response.json();
  const app = initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });

  return onAuthStateChanged(authInstance, (user) => {
    onUserChange(user || null);
  });
}

export async function signInWithGoogle() {
  if (!authInstance || !googleProvider) {
    throw new Error('Layanan login belum siap. Silakan muat ulang halaman.');
  }
  const result = await signInWithPopup(authInstance, googleProvider);
  return result.user;
}

export async function signOutUser() {
  if (!authInstance) return;
  await signOut(authInstance);
}
