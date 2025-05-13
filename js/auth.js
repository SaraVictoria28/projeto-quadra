import { auth, db } from "./firebase-config.js";
import {
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

async function login(email, senha) {
  try {
    console.log("teste");
    await signInWithEmailAndPassword(auth, email, senha);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function cadastrarUsuario(nome, email, senha) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );
    const user = userCredential.user;

    const userRef = ref(db, `usuarios/${user.uid}`); 
    await set(userRef, {
      nome: nome,
      email: email,
      criadoEm: new Date().toISOString(), // para guardar a data tbm.
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function logout() {
  await signOut(auth);
}

export { login, cadastrarUsuario, logout };
