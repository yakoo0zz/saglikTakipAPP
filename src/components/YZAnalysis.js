import Constants from 'expo-constants';
import { Configuration, OpenAIApi } from 'openai';
import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';



const YZAnalysis = ({ heartRate, bloodPressure }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const handleAnalysis = async () => {
    setLoading(true);
    try {
      // OpenAI API yapılandırması
      const configuration = new Configuration({
        apiKey: Constants.manifest?.extra?.openaiApiKey || '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'
            });

      const openai = new OpenAIApi(configuration);

      // OpenAI API'ye istekte bulunma
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `A user has the following health data: Heart Rate: ${heartRate}, Blood Pressure: ${bloodPressure}. Provide a health suggestion based on these values.`,
        max_tokens: 50,
      });

      // API yanıtını kaydetme
      setSuggestion(response.data.choices[0].text.trim());
    } catch (error) {
      console.error('OpenAI API Hatası:', error);
      setSuggestion('Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Analiz Al" onPress={handleAnalysis} />
          {suggestion ? <Text style={styles.result}>{suggestion}</Text> : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default YZAnalysis;
