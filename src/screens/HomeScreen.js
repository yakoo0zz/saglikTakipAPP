import axios from 'axios';
import { Configuration } from 'openai';
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const HomeScreen = ({ navigation }) => {
  const [activeScreen, setActiveScreen] = useState("nabız");
  const [inputValue, setInputValue] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");

  const screens = ["nabız", "tansiyon", "kan şekeri", "ateş", "oksijen", "şeker"];


  const configuration = new Configuration({
    apiKey: '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',
  });
  
const analyzeValue = async () => {
  if (inputValue.trim() === "") {
    setAnalysisResult("Lütfen bir değer girin.");
    return;
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/dbmdz/bert-base-turkish-cased", // Türkçe odaklı model URL'si
      {
        inputs: `Bu kullanıcının nabız değeri: ${inputValue}. Bu değerle ilgili bir sağlık önerisi ver.`
      },
      {
        headers: {
          Authorization: `Bearer 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`, // Access Token
        },
      }
    );

    const aiSuggestion = response.data[0]?.generated_text || "Sonuç alınamadı.";
    setAnalysisResult(aiSuggestion);
  } catch (error) {
    console.error("Hugging Face API Hatası:",  error.response?.status, error.response?.data);
    setAnalysisResult("Analiz sırasında bir hata oluştu.");
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
    minWidth: 80, // Buton genişliği
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
    fontSize: 14, // Buton yazı boyutu
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
