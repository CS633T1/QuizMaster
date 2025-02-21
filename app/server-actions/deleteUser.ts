"use server";
import admin from "firebase-admin";
import { User } from "firebase/auth";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// user: jank auth validation
// uid:  uid of user you want to delete
export async function deleteUser(user: any, uid: string) {
  if (user?.email !== "admin@gmail.com") {
    throw new Error("You are not authorized!");
  }
  // Attempt to delete the user with the provided UID
  console.log("Attempoting Delte of user ", uid);
  try {
    let res = await admin.auth().deleteUser(uid);
    return res;
  } catch (error) {
    throw error;
  }
}
