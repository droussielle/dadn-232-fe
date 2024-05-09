import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  // console.log(error);
  return (
    <Box id="error-page" sx={{ marginLeft: 3, marginTop: 3 }}>
      <img src="/favicon.svg" alt="logo of a home" height={64} />
      <h1>:( Oops!</h1>
      <p>Đã có lỗi xảy ra.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Button variant="contained" component={Link} to="/">
        Quay về trang chủ
      </Button>
    </Box>
  );
}
