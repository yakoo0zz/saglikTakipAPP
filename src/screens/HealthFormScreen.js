import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import YZAnalysis from '../components/YZAnalysis';

const HealthFormScreen = () => {
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleSubmit = () => {
    if (!heartRate || !bloodPressure) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    // Analiz ekranını göster
    setShowAnalysis(true);
  };

  return (
    <View style={styles.container}>
      {!showAnalysis ? (
        <>
          <Text style={styles.title}>Sağlık Bilgilerini Gir</Text>
          <TextInput
            style={styles.input}
            placeholder="Kalp Atışı (BPM)"
            keyboardType="numeric"
            value={heartRate}
            onChangeText={setHeartRate}
          />
          <TextInput
            style={styles.input}
            placeholder="Tansiyon (ör. 120/80)"
            value={bloodPressure}
            onChangeText={setBloodPressure}
          />
          <Button title="Gönder" onPress={handleSubmit} />
        </>
      ) : (
        <YZAnalysis heartRate={heartRate} bloodPressure={bloodPressure} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default HealthFormScreen;
