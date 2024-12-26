import axios from "axios";
import { push, ref } from "firebase/database";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase"; // Firebase konfigürasyonu

const HomeScreen = ({ navigation }) => {
  const [activeScreen, setActiveScreen] = useState("nabız");
  const [inputValue, setInputValue] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");

  const screens = ["nabız", "tansiyon", "kan şekeri", "ateş", "oksijen", "şeker"];

  const saveToFirebase = async (data) => {
    try {
      const dbRef = ref(db, "healthData");
      await push(dbRef, data);
      console.log("Veri başarıyla Firebase'e kaydedildi:", data);
    } catch (error) {
      console.error("Firebase'e veri kaydedilirken hata oluştu:", error);
    }
  };

  const analyzeValue = async () => {
    if (inputValue.trim() === "") {
      setAnalysisResult("Lütfen bir değer girin.");
      return;
    }

    try {
      // Değerin geçerli bir sayı olduğundan emin olun
      const numericValue = parseFloat(inputValue);
      if (isNaN(numericValue)) {
        setAnalysisResult("Geçersiz değer! Lütfen bir sayı girin.");
        return;
      }

      // Flask API'ye istek gönder
      const response = await axios.post(
        "http://192.168.10.177:5000/predict",
        {
          parametre: activeScreen, // Seçilen parametre
          değer: numericValue, // Girilen değer (sayısal)
        },
        { timeout: 10000 } // 10 saniye zaman aşımı
      );

      // API'den gelen cevabı al
      const suggestion = response.data.öneri || "Sonuç alınamadı.";
      const status = response.data.durum || "Durum belirtilmedi.";

      const analysisData = {
        parametre: activeScreen,
        değer: numericValue,
        durum: status,
        öneri: suggestion,
        timestamp: new Date().toISOString(),
      };
      
      setAnalysisResult(
        `Parametre: ${activeScreen}\nDeğer: ${numericValue}\nDurum: ${status}\nÖneri: ${suggestion}`
      );

      // Veriyi Firebase'e kaydet
      await saveToFirebase(analysisData);
    } catch (error) {
      // Daha detaylı hata mesajı
      console.error("Flask API Hatası:");
      console.error("Durum Kodu:", error.response?.status || "Durum Kodu Yok");
      console.error("Hata Verisi:", error.response?.data || "Hata Verisi Yok");
      console.error("Headers:", error.response?.headers || "Headers Yok");
      console.error("İstek URL'si:", error.config?.url || "URL Yok");
      console.error("İstek Verisi:", error.config?.data || "Veri Yok");
      console.error("Tam Hata Mesajı:", error.message || "Mesaj Yok");

      setAnalysisResult("Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 1. Bölge: Kaydırılabilir Butonlar */}
      <ScrollView
        horizontal
        style={styles.navbar}
        showsHorizontalScrollIndicator={false}
      >
        {screens.map((screen) => (
          <TouchableOpacity
            key={screen}
            style={[
              styles.navButton,
              activeScreen === screen
                ? styles.activeButton
                : styles.inactiveButton,
            ]}
            onPress={() => setActiveScreen(screen)}
          >
            <Text style={styles.navButtonText}>{screen}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 2. Bölge: Text Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={`Buraya ${activeScreen} değerini girin...`}
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          keyboardType="numeric" // Sadece sayı girişi
        />
      </View>

      {/* 3 ve 4. Bölge: Analiz ve Geçmiş Butonları */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.smallButton} onPress={analyzeValue}>
          <Text style={styles.buttonText}>Analiz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate("Geçmiş")}
        >
          <Text style={styles.buttonText}>Geçmiş Değerler</Text>
        </TouchableOpacity>
      </View>

      {/* 5. Bölge: Analiz Sonuçları */}
      <View style={styles.contentBox}>
        <Text style={styles.contentText}>
          {analysisResult || "Burada analiz sonuçları görünecek."}
        </Text>
      </View>
    </ScrollView>
  );
};

// Tarzlar
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  navbar: {
    flexDirection: "row",
    marginBottom: 20,
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    minWidth: 80,
    maxHeight: 60,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "green",
  },
  inactiveButton: {
    backgroundColor: "red",
  },
  navButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  smallButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  contentBox: {
    backgroundColor: "#e9e9e9",
    padding: 20,
    borderRadius: 10,
  },
  contentText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default HomeScreen;
