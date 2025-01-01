import axios from "axios";
import { push, ref } from "firebase/database";
import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { db } from "../../firebase"; // Firebase konfigürasyonu

const HomeScreen = ({ navigation }) => {
  const [activeScreen, setActiveScreen] = useState("nabız");
  const [inputValue, setInputValue] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const screens = ["nabız", "tansiyon", "kan şekeri", "ateş", "oksijen", "şeker"];
  const weeklyData = [65, 72, 80, 68, 74, 79, 85]; // Haftalık veriler
  const dailyData = [62, 68, 70, 65, 72, 78, 75]; // Günlük veriler

  const toggleModal = () => setModalVisible(!isModalVisible);

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
      const numericValue = parseFloat(inputValue);
      if (isNaN(numericValue)) {
        setAnalysisResult("Geçersiz değer! Lütfen bir sayı girin.");
        return;
      }

      const response = await axios.post(
        "http://192.168.10.177:5000/predict",
        {
          parametre: activeScreen,
          değer: numericValue,
        },
        { timeout: 10000 }
      );

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

      await saveToFirebase(analysisData);
    } catch (error) {
      console.error("Flask API Hatası:", error.message);
      setAnalysisResult("Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/back.png")} // Arka plan resmi
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Kaydırılabilir Butonlar */}
        <ScrollView horizontal style={styles.navbar}>
          {screens.map((screen) => (
            <TouchableOpacity
              key={screen}
              style={[
                styles.navButton,
                activeScreen === screen ? styles.activeButton : styles.inactiveButton,
              ]}
              onPress={() => setActiveScreen(screen)}
            >
              <Text style={styles.navButtonText}>{screen}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Giriş Alanı */}
        <TextInput
          style={styles.input}
          placeholder={`Buraya ${activeScreen} değerini girin...`}
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          keyboardType="numeric"
        />

        {/* Analiz Butonu */}
        <TouchableOpacity style={styles.customButton} onPress={analyzeValue}>
          <Text style={styles.customButtonText}>Analiz Et</Text>
        </TouchableOpacity>

        {/* Analiz Sonucu */}
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            {analysisResult || "Burada analiz sonuçları görünecek."}
          </Text>
        </View>

        {/* Grafik */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Haftalık Veriler</Text>
          <TouchableOpacity onPress={toggleModal}>
            <LineChart
              data={{
                labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
                datasets: [{ data: weeklyData }],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              chartConfig={{
                backgroundGradientFrom: "#6a11cb",
                backgroundGradientTo: "#2575fc",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              style={styles.chart}
            />
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Tüm Veriler</Text>
              <LineChart
                data={{
                  labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
                  datasets: [
                    { data: weeklyData, color: () => `rgba(255, 0, 0, 1)` },
                    { data: dailyData, color: () => `rgba(0, 255, 0, 1)` },
                  ],
                  legend: ["Haftalık", "Günlük"],
                }}
                width={Dimensions.get("window").width - 40}
                height={300}
                chartConfig={{
                  backgroundGradientFrom: "#6a11cb",
                  backgroundGradientTo: "#2575fc",
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                style={styles.chart}
              />
              <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  navbar: {
    flexDirection: "row",
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
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
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  customButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  customButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultBox: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    textAlign: "center",
  },
  chartContainer: {
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
    textAlign: "center",
  },
  chart: {
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default HomeScreen;
