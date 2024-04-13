import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';
import axios from 'axios';
import { useEffect, useState } from 'react';

import DeviceCard from '../../components/device';
import StatusCard from '../../components/status';

export default function HomePage() {
  const [temperature, setTemperature] = useState([]);
  const [brightness, setBrightness] = useState([]);
  const [motionSensing, setMotion] = useState([]);
  const [devices, setDevices] = useState([]);

  const fetchInfo = () => {
    axios
      .get(`http://localhost:3001/api/record/getSensorData/temp-sensor`)
      .then((res) => {
        setTemperature(res.data[0].value);
      });
    axios
      .get(`http://localhost:3001/api/record/getSensorData/light-sensor`)
      .then((res) => {
        setBrightness(res.data[0].value);
      });
    axios.get(`http://localhost:3001/api/record/getSensorData/pir-sensor`).then((res) => {
      setMotion(res.data[0].value);
    });
    axios.get(`http://localhost:3001/api/record/getAllSensors`).then((res) => {
      setDevices(res.data);
    });
    return 0;
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <Stack
      component="main"
      spacing={3}
      sx={{ flexGrow: 1, bgcolor: 'background.default', px: 2 }}
    >
      <Toolbar />
      <Stack direction="row" spacing={2}>
        <StatusCard item="temp" value={{ temperature }} />
        <StatusCard item="brightness" value={{ brightness }} />
        <StatusCard item="motion" value={{ motionSensing }} />
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
        {devices.map((item, index) => (
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
        {/* <DeviceCard />
        <DeviceCard item="pump" />
        <DeviceCard /> */}
        <DeviceCard item="lights" name="light" />
        <DeviceCard item="sprinkler" name="sprinkler" />
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
    </Stack>
  );
}
