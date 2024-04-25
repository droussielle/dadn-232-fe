import { FormControl, InputLabel,MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Line, Radar } from 'react-chartjs-2';

const SensorChart = () => {
  const [sensorData, setSensorData] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState('light-sensor');

  Chart.register(...registerables);

  useEffect(() => {
    let isMounted = true;
    // fetchData(selectedSensor);
    const fetchData = async (sensor: string) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/record/getSensorData/${sensor}`,
        );
        if (isMounted) {
          const sortedData = response.data.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
          );
          setSensorData(sortedData);
        }
        // setSensorData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(selectedSensor);

    return () => {
      isMounted = false;
    };
  }, [selectedSensor]);

  const renderChart = () => {
    switch (selectedSensor) {
      case 'light-sensor':
        return <Line data={createLineChartData()} />;
      case 'temp-sensor':
        return <Bar data={createBarChartData()} />;
      case 'pir-sensor':
        return <Bar data={createRadarChartData()} />;
      default:
        return null;
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formattedDate} ${formattedTime}`;
  };

  const createLineChartData = () => {
    return {
      labels: sensorData.map((data) => formatDateTime(data.createdAt)),
      datasets: [
        {
          label: 'Light Sensor',
          data: sensorData.map((data) => data.value),
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        },
      ],
    };
  };

  const createBarChartData = () => {
    return {
      labels: sensorData.map((data) => formatDateTime(data.createdAt)),
      datasets: [
        {
          label: 'Temperature Sensor',
          data: sensorData.map((data) => data.value),
          backgroundColor: 'rgb(54, 162, 235)',
        },
      ],
    };
  };

  const createRadarChartData = () => {
    return {
      labels: sensorData.map((data) => formatDateTime(data.createdAt)),
      datasets: [
        {
          label: 'PIR Sensor',
          data: sensorData.map((data) => (data.value === 'true' ? 1 : 0)), // Convert true/false to 1/0
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div>
      <h4>Sensor Chart</h4>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel sx={{ marginBottom: 40 }} id="sensor-select-label">Select Sensor</InputLabel>
        <Select
          labelId="sensor-select-label"
          value={selectedSensor}
          onChange={(e) => setSelectedSensor(e.target.value)}
        >
          <MenuItem value="light-sensor">Light Sensor</MenuItem>
          <MenuItem value="temp-sensor">Temperature Sensor</MenuItem>
          <MenuItem value="pir-sensor">PIR Sensor</MenuItem>
        </Select>
      </FormControl>

      {/* <select value={selectedSensor} onChange={(e) => setSelectedSensor(e.target.value)}>
        <option value="light-sensor">Light Sensor</option>
        <option value="temp-sensor">Temperature Sensor</option>
        <option value="pir-sensor">PIR Sensor</option>
      </select> */}

      {renderChart()}
    </div>
  );
};

export default SensorChart;
