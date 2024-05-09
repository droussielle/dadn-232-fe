import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightModeIcon from '@mui/icons-material/LightMode';
import ShowerIcon from '@mui/icons-material/Shower';
import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ActivityLogTable from '../components/ActivityLogTable';
import DeviceActivity from '../components/DeviceActivity';
import DeviceCard from '../components/deviceCard';
import SensorChart from '../components/SensorChart';
import StatusCard from '../components/statusCard';

export default function HomePage() {
  const navigate = useNavigate();
  const [temperature, setTemperature] = useState([]);
  const [brightness, setBrightness] = useState([]);
  const [motionSensing, setMotion] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [devices, setDevices] = useState([]);
  const [temp_threshold, setTempThreshold] = useState([]);
  const [brightness_threshold, setBrightnessThreshold] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

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
      })
      .catch((err) => {});
    axios
      .get(`http://localhost:3001/api/record/getSensorData/light-sensor`)
      .then((res) => {
        setBrightness(res.data[0]);
      })
      .catch((err) => {});
    axios
      .get(`http://localhost:3001/api/record/getSensorData/pir-sensor`)
      .then((res) => {
        setMotion(res.data[0]);
      })
      .catch((err) => {});
    axios
      .get(`http://localhost:3001/api/record/getAllSensors`)
      .then((res) => {
        setSensors(res.data);
      })
      .catch((err) => {});
    axios
      .get(`http://localhost:3001/api/device/getAllDevices`, config)
      .then((res) => {
        setDevices(res.data);
        // devices[0].image = '/led.png';
        // devices[1].image = '/led.png';
        setTempThreshold(res.data[0].thresholdValue);
        setBrightnessThreshold(res.data[1].thresholdValue);
      })
      .catch((err) => {
        logOut('Vui lòng đăng nhập lại để truy cập vào ứng dụng');
      });
    if (temperature && brightness && motionSensing && sensors && devices) {
      setHasLoaded(true);
    }
    return 0;
  };

  const logOut = (error_message) => {
    localStorage.clear();
    navigate(
      '/login',
      error_message && {
        state: { error: true, message: error_message },
      },
    );
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      logOut('Vui lòng đăng nhập lại để truy cập vào ứng dụng');
    }
    const interval = setInterval(() => fetchInfo(), 3000);
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!hasLoaded}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {temperature.value > temp_threshold ? (
        <Alert severity="warning" id="temp_warning">
          Cảnh báo! Nhiệt độ hiện tại vượt quá ngưỡng
        </Alert>
      ) : null}
      {brightness.value > brightness_threshold ? (
        <Alert severity="warning" id="brightness_warning">
          Cảnh báo! Độ sáng hiện tại vượt quá ngưỡng
        </Alert>
      ) : null}
      <Stack direction="row" spacing={2}>
        <StatusCard
          title="Nhiệt độ hiện tại"
          icon={<DeviceThermostatIcon />}
          value={temperature.value + '°C'}
          lastUpdated={temperature.createdAt}
        />
        <StatusCard
          title="Độ sáng hiện tại"
          icon={<LightModeIcon />}
          value={brightness.value + '%'}
          lastUpdated={brightness.createdAt}
        />
        <StatusCard
          title="Có người"
          icon={<DirectionsRunIcon />}
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
        <Button
          onClick={() => {
            navigate('/devices');
          }}
        >
          Xem tất cả
        </Button>
      </Box>
      <Stack direction="row" spacing={2}>
        {sensors.map((item, index) => (
          <DeviceCard
            key={index}
            item="sensor"
            name={item.name}
            id={item.id}
            icon={<LightbulbIcon />}
          />
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
        <Button
          onClick={() => {
            navigate('/devices');
          }}
        >
          Xem tất cả
        </Button>
      </Box>
      <Stack direction="row" spacing={2}>
        {/* {console.log(devices)} */}
        {devices.map((item, index) => (
          <DeviceCard
            key={index}
            item="device"
            name={item.name}
            id={item.id}
            icon={<ShowerIcon />}
            // imagePath={item.image}
          />
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
        <Button
          onClick={() => {
            navigate('/report');
          }}
        >
          Xem tất cả
        </Button>
      </Box>
      <SensorChart />
      <DeviceActivity />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">Lịch sử hoạt động</Typography>
        <Button
          onClick={() => {
            navigate('/history');
          }}
        >
          Xem tất cả
        </Button>
      </Box>
      <ActivityLogTable />
    </Stack>
  );
}
