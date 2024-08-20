const axios = require('axios');

// Predefined list of 5 MAC addresses
const macAddresses = [
  '8F:25:D4:B5:E3:3C',
  'FB:F6:69:43:48:55',
  '13:11:3D:E0:38:1C',
  '9B:08:91:68:43:20',
  '47:BA:12:91:F4:9E',
  '00:1A:2B:3C:4D:5E'
];

// Function to generate random sensor values
function generateSensorData() {
  return {
    Temperature: parseFloat((Math.random() * 40).toFixed(2)),
    Salinity: parseFloat((Math.random() * 40).toFixed(2)),
    PH: parseFloat((Math.random() * 14).toFixed(2)),
    ORP: parseFloat((Math.random() * 600).toFixed(2)),
    Oxygen_Percent: parseFloat((Math.random() * 100).toFixed(2)),
    Oxygen_mgL: parseFloat((Math.random() * 10).toFixed(2)),
    Battery: parseFloat((Math.random() * 100).toFixed(2)),
  };
}

function sendMockData() {
  // Randomly select a MAC address from the list
  const macAddress = macAddresses[Math.floor(Math.random() * macAddresses.length)];

  const mockData = {
    MacAddress: macAddress,
    ...generateSensorData(),
  };

  console.log('Sending data:', mockData);

  axios.post('http://localhost:3001/sensorTopic', mockData)
    .then(response => {
      console.log('Data sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending data:', error.response ? error.response.data : error.message);
    });
}

// Send data every 5 seconds
setInterval(sendMockData, 5000);
