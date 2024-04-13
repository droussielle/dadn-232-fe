import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import LightModeIcon from '@mui/icons-material/LightMode';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';

export default function StatusCard({ item, value }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {item == 'temp' ? 'Nhiệt độ hiện tại' : 'Độ sáng hiện tại'}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
          {item == 'temp' ? (
            <DeviceThermostatIcon fontSize="large" />
          ) : (
            <LightModeIcon fontSize="large" />
          )}
          <Typography variant="h4">
            {item == 'temp' ? value.temperature + '°C' : value.brightness + '%'}
          </Typography>
        </Stack>
        <Typography variant="body2">Cập nhật lần cuối: phút trước</Typography>
      </CardContent>
    </Card>
  );
}
