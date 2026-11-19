// Client-side Firebase loader using official Google Firebase ESM CDN
// This avoids node_modules bloat and supports browser environments directly.

let authInstance: any = null;
let googleProvider: any = null;

export async function loadFirebaseAuth(onUserChange: (user: any) => void) {
  if (typeof window === 'undefined') return;

  try {
    const res = await fetch('/firebase-applet-config.json');
    if (!res.ok) return;
    const config = await res.json();

    // @ts-ignore
    const { initializeApp } = await import(/* webpackIgnore: true */ 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js');
    // @ts-ignore
    const { getAuth, GoogleAuthProvider, onAuthStateChanged } = await import(/* webpackIgnore: true */ 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js');

    const app = initializeApp(config);
    authInstance = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    onAuthStateChanged(authInstance, (user: any) => {
      onUserChange(user || null);
    });
  } catch (err) {
    console.warn('Firebase CDN initialization skipped:', err);
  }
}

export async function signInWithGooglePopup() {
  if (!authInstance || !googleProvider) {
    throw new Error('Firebase Auth belum siap.');
  }
  // @ts-ignore
  const { signInWithPopup } = await import(/* webpackIgnore: true */ 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js');
  const result = await signInWithPopup(authInstance, googleProvider);
  return result.user;
}

export async function signOutFirebase() {
  if (!authInstance) return;
  // @ts-ignore
  const { signOut } = await import(/* webpackIgnore: true */ 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js');
  await signOut(authInstance);
}
