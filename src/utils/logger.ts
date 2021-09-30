import { db } from '../firebase';
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore"; 

export const logger = async (roomCode: string, participant: string, message: string) => {
  const docRef = doc(db, "rooms", roomCode);

  await updateDoc(docRef, {
    log: arrayUnion({
      timestamp: Timestamp.now(),
      participant: participant,
      message,
    }),
  }).catch(err => console.error(err));  
}