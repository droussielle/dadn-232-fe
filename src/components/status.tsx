import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LightModeIcon from '@mui/icons-material/LightMode';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';

export default function StatusCard({ item, value, lastUpdated }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {item == 'temp' ? 'Nhiệt độ hiện tại' : ''}
          {item == 'brightness' ? 'Độ sáng hiện tại' : ''}
          {item == 'motion' ? 'Có người' : ''}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
          {item == 'temp' ? <DeviceThermostatIcon fontSize="large" /> : ''}
          {item == 'brightness' ? <LightModeIcon fontSize="large" /> : ''}
          {item == 'motion' ? <DirectionsRunIcon fontSize="large" /> : ''}
          <Typography variant="h4">
            {item == 'temp' ? value + '°C' : ''}
            {item == 'brightness' ? value + '%' : ''}
            {item == 'motion' ? value : ''}
          </Typography>
        </Stack>
        <Typography variant="body2">
          Cập nhật lần cuối: {new Date(lastUpdated).toLocaleString('en-GB')}
        </Typography>
      </CardContent>
    </Card>
  );
}
