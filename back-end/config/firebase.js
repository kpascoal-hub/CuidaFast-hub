import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

// Carrega credenciais privadas
const serviceAccount = JSON.parse(
  readFileSync(path.resolve("api/config/firebase-service-key.json"), "utf8")
);

// Inicializa o Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const auth = admin.auth();

