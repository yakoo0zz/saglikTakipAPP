// processData.js
export const processHealthDataForChart = (healthData) => {
    const sortedData = healthData.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  
    const labels = sortedData.map((item) =>
      new Date(item.timestamp).toLocaleDateString()
    );
    const data = sortedData.map((item) => item.değer);
  
    return {
      labels,
      datasets: [
        {
          data,
        },
      ],
    };
  };
  