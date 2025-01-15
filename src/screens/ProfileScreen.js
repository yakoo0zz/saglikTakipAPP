import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const ProfileScreen = () => {
  const [height, setHeight] = useState(""); // Boy (cm)
  const [weight, setWeight] = useState(""); // Kilo (kg)
  const [bmi, setBmi] = useState(null); // Hesaplanan VKE
  const [category, setCategory] = useState(""); // VKE kategorisi

  const calculateBMI = () => {
    if (!height || !weight) {
      setBmi(null);
      setCategory("Lütfen tüm alanları doldurun.");
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const calculatedBMI = parseFloat(weight) / (heightInMeters * heightInMeters);
    setBmi(calculatedBMI.toFixed(1)); // Virgülden sonra 1 basamak göster

    // VKE kategorisini belirleme
    if (calculatedBMI < 18.5) {
      setCategory("Zayıf");
    } else if (calculatedBMI >= 18.5 && calculatedBMI <= 24.9) {
      setCategory("Normal");
    } else if (calculatedBMI >= 25 && calculatedBMI <= 29.9) {
      setCategory("Kilolu");
    } else if (calculatedBMI >= 30 && calculatedBMI <= 34.9) {
      setCategory("1. Derece Obez");
    } else {
      setCategory("3. Derece (Morbid) Obez");
    }
  };

  const getImageForCategory = () => {
    switch (category) {
      case "Zayıf":
        return require("../assets/image/zayif.png");
      case "Normal":
        return require("../assets/image/normal.png");
      case "Kilolu":
        return require("../assets/image/kilolu.png");
      case "1. Derece Obez":
        return require("../assets/image/obez.png");
      case "3. Derece (Morbid) Obez":
        return require("../assets/image/mobredObez.png");
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vücut Kitle Endeksi (VKE) Hesaplama</Text>

      {/* Boy Girişi */}
      <TextInput
        style={styles.input}
        placeholder="Boyunuzu girin (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={(text) => setHeight(text)}
      />

      {/* Kilo Girişi */}
      <TextInput
        style={styles.input}
        placeholder="Kilonuzu girin (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={(text) => setWeight(text)}
      />

      {/* Hesapla Butonu */}
      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Hesapla</Text>
      </TouchableOpacity>

      {/* VKE Sonuçları */}
      {bmi && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>VKE: {bmi}</Text>
          <Text style={styles.resultText}>Kategori: {category}</Text>
          {getImageForCategory() && (
            <Image source={getImageForCategory()} style={styles.image} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultBox: {
    marginTop: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  image: {
    width: 100,
    height: 150,
    marginTop: 10,
    resizeMode: "contain",
  },
});

export default ProfileScreen;
