import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  DocumentData,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { LLMResponse } from "@/app/services/api";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export interface QuizData extends LLMResponse {
  quizTitle?: String;
  userId?: String;
  score?: number | null;
}

export const saveNewQuiz = async (data: QuizData) => {
  const saveQuizRes = await addDoc(collection(db, "quizzes"), {
    quizTitle: data.quizTitle,
    userId: data.userId,
    questions: data.questions,
    score: data?.score,
  } as QuizData);
  console.log("Document written with ID: ", saveQuizRes.id);
  return saveQuizRes;
};

export const getPastQuiz = async (user: User) => {
  //db, collection, id
  const q = query(
    collection(db, "quizzes"),
    where("userId", "==", user?.email)
  );

  const querySnapshot = await getDocs(q);
  let data: any[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data?.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  console.log(data);
  return data;
};

export const getQuizData = async (quizId: string) => {
  const quizRef = doc(db, "quizzes", quizId);
  const quizSnap = await getDoc(quizRef);

  if (quizSnap.exists()) {
    return quizSnap.data();
  } else {
    console.error("Quiz not found");
  }
};

export const saveQuiz = async (
  // newScore: number,
  data?: QuizData,
  quizId?: string
) => {
  if (!quizId) return saveNewQuiz(data as QuizData);

  // The user passed a quizId....
  const quizRef = doc(db, "quizzes", quizId as string);
  const quizSnap = await getDoc(quizRef);

  const quizData = quizSnap?.data();

  // If Quiz Exists in DB, then update the score
  if (quizSnap.exists()) {
    try {
      const res = await updateDoc(quizRef, { ...quizData, ...data });
      console.log("Updating Quiz with the following....", {
        ...quizData,
        ...data,
      });
      console.log("Quiz score updated successfully");
      return { id: quizId };
    } catch (error) {
      console.error("Error updating quiz score:", error);
    }
  }
  // Else this does not exist in the DB, make new entry.
  else {
    return saveNewQuiz(data as QuizData);
  }
};
