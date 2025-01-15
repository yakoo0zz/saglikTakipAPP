import { onValue, ref } from "firebase/database";
import moment from "moment"; // Tarih işlemleri için moment.js kullanımı

const fetchGraphData = async () => {
  try {
    const dbRef = ref(db, "healthData");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const groupedDailyData = {};
        const groupedWeeklyData = {};

        Object.keys(data).forEach((key) => {
          const record = data[key];
          const date = moment(record.timestamp).format("YYYY-MM-DD");
          const week = moment(record.timestamp).week();

          // Günlük verileri gruplama
          if (!groupedDailyData[date]) groupedDailyData[date] = [];
          groupedDailyData[date].push(record.değer);

          // Haftalık verileri gruplama
          if (!groupedWeeklyData[week]) groupedWeeklyData[week] = [];
          groupedWeeklyData[week].push(record.değer);
        });

        // Günlük ve haftalık ortalamaları hesaplama
        const dailyAverages = Object.keys(groupedDailyData).map((date) => ({
          label: date,
          value:
            groupedDailyData[date].reduce((sum, val) => sum + val, 0) /
            groupedDailyData[date].length,
        }));

        const weeklyAverages = Object.keys(groupedWeeklyData).map((week) => ({
          label: `Hafta ${week}`,
          value:
            groupedWeeklyData[week].reduce((sum, val) => sum + val, 0) /
            groupedWeeklyData[week].length,
        }));

        // Grafikte kullanılacak veriler
        setGraphData({
          daily: dailyAverages,
          weekly: weeklyAverages,
        });
      }
    });
  } catch (error) {
    console.error("Firebase'den veri alınırken hata oluştu:", error);
  }
};
