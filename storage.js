import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

export const saveHealthData = async (data) => {
  try {
    // Veri doğrulama
    if (!data.parametre || typeof data.parametre !== 'string') {
      throw new Error("Geçersiz veri: 'parametre' alanı eksik veya hatalı.");
    }
    if (typeof data.değer !== 'number') {
      throw new Error("Geçersiz veri: 'değer' alanı eksik veya hatalı.");
    }
    if (!data.durum || typeof data.durum !== 'string') {
      throw new Error("Geçersiz veri: 'durum' alanı eksik veya hatalı.");
    }
    if (!data.öneri || typeof data.öneri !== 'string') {
      throw new Error("Geçersiz veri: 'öneri' alanı eksik veya hatalı.");
    }

    // Firebase'e veri ekleme
    const docRef = await addDoc(collection(db, "healthData"), data);
    console.log("Belge başarıyla kaydedildi. Belge ID'si:", docRef.id);
  } catch (error) {
    // Detaylı hata mesajları
    console.error("Firebase'e veri kaydedilirken hata oluştu:", error.message);
    throw error;
  }
};
