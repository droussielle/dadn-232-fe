import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';
import axios from 'axios';
import { useEffect, useState } from 'react';

import ActivityLogTable from '../components/ActivityLogTable';
import DeviceCard from '../components/device';
import StatusCard from '../components/status';

export default function HomePage() {
  const [temperature, setTemperature] = useState([]);
  const [brightness, setBrightness] = useState([]);
  const [motionSensing, setMotion] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [devices, setDevices] = useState([]);
  const [temp_threshold, setTempThreshold] = useState([]);
  const [brightness_threshold, setBrightnessThreshold] = useState([]);

  const fetchInfo = () => {
    const bearer_token = `Bearer ${localStorage.getItem('token')}`;
    const config = {
      headers: {
        Authorization: bearer_token,
      },
    };
    axios
      .get(`http://localhost:3001/api/record/getSensorData/temp-sensor`)
      .then((res) => {
        setTemperature(res.data[0]);
      });
    axios
      .get(`http://localhost:3001/api/record/getSensorData/light-sensor`)
      .then((res) => {
        setBrightness(res.data[0]);
      });
    axios.get(`http://localhost:3001/api/record/getSensorData/pir-sensor`).then((res) => {
      setMotion(res.data[0]);
    });
    axios.get(`http://localhost:3001/api/record/getAllSensors`).then((res) => {
      setSensors(res.data);
    });
    axios.get(`http://localhost:3001/api/device/getAllDevices`, config).then((res) => {
      setDevices(res.data);
      setTempThreshold(res.data[1].thresholdValue);
      setBrightnessThreshold(res.data[0].thresholdValue);
      // console.log(temperature, brightness);
      // console.log(temp_threshold, brightness_threshold);
    });
    return 0;
  };

  useEffect(() => {
    const interval = setInterval(() => fetchInfo(), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Stack
      component="main"
      spacing={3}
      sx={{ flexGrow: 1, bgcolor: 'background.default', px: 2, paddingLeft: 34 }}
    >
      <Toolbar />
      {temperature.value > temp_threshold ? (
        <Alert severity="warning" id="temp_warning">
          Cảnh báo! Nhiệt độ hiện tại vượt quá ngưỡng cho phép
        </Alert>
      ) : null}
      {brightness.value > brightness_threshold ? (
        <Alert severity="warning" id="brightness_warning">
          Cảnh báo! Độ sáng hiện tại vượt quá ngưỡng cho phép
        </Alert>
      ) : null}
      <Stack direction="row" spacing={2}>
        <StatusCard
          item="temp"
          value={temperature.value}
          lastUpdated={temperature.createdAt}
        />
        <StatusCard
          item="brightness"
          value={brightness.value}
          lastUpdated={brightness.createdAt}
        />
        <StatusCard
          item="motion"
          value={motionSensing.value}
          lastUpdated={motionSensing.createdAt}
        />
      </Stack>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">Các thiết bị cảm biến</Typography>
        <Button>Xem tất cả</Button>
      </Box>
      <Stack direction="row" spacing={2}>
        {sensors.map((item, index) => (
          // <DeviceCard item={"lights"} name={"hello"} type={"sensor"} />
          <DeviceCard key={index} item="sensor" name={item.name} />
        ))}
      </Stack>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">Các thiết bị đầu ra</Typography>
        <Button>Xem tất cả</Button>
      </Box>
      <Stack direction="row" spacing={2}>
        {devices.map((item, index) => (
          <DeviceCard key={index} item="device" name={item.name} id={item.id} />
        ))}
      </Stack>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">Thống kê</Typography>
        <Button>Xem tất cả</Button>
      </Box>
      <ActivityLogTable />
    </Stack>
  );
}
