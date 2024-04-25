import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function MultiLineChart() {
  interface SensorData {
    value: number | string | boolean;
    key: string;
    createdAt: string;
  }

  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [selectedSensors]);

  const fetchData = async () => {
    try {
      const requests = selectedSensors.map((sensor) =>
        axios.get(`http://localhost:3001/api/record/getSensorData/${sensor}`),
      );
      const responses = await Promise.all(requests);
      const sensorData = responses.map((response) => response.data);
      setSensorData(sensorData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSensorChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedSensors([...selectedSensors, value]);
    } else {
      setSelectedSensors(selectedSensors.filter((sensor) => sensor !== value));
    }
  };

  return (
    <div>
      <FormControl component="fieldset">
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedSensors.includes('light-sensor')}
                onChange={handleSensorChange}
                value="light-sensor"
              />
            }
            label="Light Sensor"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedSensors.includes('temp-sensor')}
                onChange={handleSensorChange}
                value="temp-sensor"
              />
            }
            label="Temperature Sensor"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedSensors.includes('pir-sensor')}
                onChange={handleSensorChange}
                value="pir-sensor"
              />
            }
            label="PIR Sensor"
          />
        </FormGroup>
      </FormControl>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={sensorData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="createdAt" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          {selectedSensors.map((sensor) => (
            <Line
              key={sensor}
              type="monotone"
              dataKey="value"
              yAxisId={sensor === 'pir-sensor' ? 'right' : 'left'}
              stroke={getColor(sensor)}
              name={sensor}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MultiLineChart;
