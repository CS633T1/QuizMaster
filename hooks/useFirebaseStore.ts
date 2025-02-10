import { collection, addDoc, query, where, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config"
import { LLMResponse } from "@/app/services/api";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export interface QuizData extends LLMResponse {
    quizTitle: String,
    userId: String,
    userScore?: number | null,
}

export const saveQuiz = async (data: QuizData) => {
    const saveQuizRes = await addDoc(collection(db, "quizzes"), {
        quizTitle: data.quizTitle,
        userId: data.userId,
        questions: data.questions,
        score: data?.userScore
    } as QuizData);
    console.log("Document written with ID: ", saveQuizRes.id);
    return saveQuizRes;
}

export const getPastQuiz = async (user: User) => {
    //db, collection, id
    const q = query(collection(db, "quizzes"), where("userId", "==", user?.email));

    const querySnapshot = await getDocs(q);
    let data: any[] = [];
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        data?.push({
            id: doc.id,
            ...doc.data()
        });
    });

    console.log(data);
    return data;
}