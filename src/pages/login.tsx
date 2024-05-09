import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const location = useLocation();
  const username_ref = useRef();
  const password_ref = useRef();
  const [username_empty, setUsernameEmpty] = useState({ status: false, message: null });
  const [password_empty, setPasswordEmpty] = useState({ status: false, message: null });
  const [backdrop_open, setBackdrop] = useState(false);
  const [login_fail, setLoginFail] = useState({ status: false, message: null });
  const redirect = useRef({ status: false, message: null });
  if (location.state) {
    redirect.current = { status: location.state.error, message: location.state.message };
  }
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    location.state = 0;
    redirect.current = { status: false, message: null };
    if (!username_ref?.current.value || !password_ref?.current.value) {
      if (!username_ref?.current.value) {
        setUsernameEmpty({ status: true, message: 'Username không được để trống' });
      }
      if (!password_ref.current.value) {
        setPasswordEmpty({ status: true, message: 'Mật khẩu không được để trống' });
      }
      return;
    }
    setBackdrop(true);
    axios
      .post(`http://localhost:3001/api/auth/signin`, {
        username: username_ref.current.value,
        password: password_ref.current.value,
      })
      .then((res) => {
        setBackdrop(false);
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('name', res.data.user.name);
        navigate('/');
      })
      .catch((err) => {
        setBackdrop(false);
        setLoginFail({
          status: true,
          message:
            'Đăng nhập không thành công. Vui lòng kiểm tra lại username hoặc mật khẩu.',
        });
      });
  };
  return (
    <>
      <Stack id="container" direction="row">
        {/* <img
          src="/login.png"
          alt="a room with furniture"
          style={{ width: '50%', height: '100%' }}
        /> */}
        <Box sx={{ width: '60%', height: '100%' }}>
          <img
            src={`/login.png`}
            alt="a room with furniture"
            style={{ height: '100vh', width: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box
          display="flex"
          sx={{
            justifyContent: 'space-between',
            width: '40%',
            height: '100vh',
            paddingX: 10,
            paddingY: 5,
            boxSizing: 'border-box',
          }}
          flexDirection="column"
        >
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdrop_open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Box
            display="flex"
            flexDirection="column"
            component="form"
            gap={2}
            onSubmit={handleLogin}
          >
            <img src="/favicon.svg" alt="logo of a home" height={64} />
            <Typography variant="h6">Đăng nhập</Typography>
            {(redirect.current.status || login_fail.status) && (
              <Alert severity="error">
                {redirect.current.message || login_fail.message}
              </Alert>
            )}
            <TextField
              required
              id="username-input"
              label="Username"
              variant="outlined"
              inputRef={username_ref}
              error={username_empty.status}
              helperText={username_empty.message}
              onChange={() => {
                setUsernameEmpty({
                  status: false,
                  message: null,
                });
                setLoginFail({ status: false, message: null });
              }}
            />
            <TextField
              id="password-input"
              variant="outlined"
              label="Mật khẩu"
              type="password"
              autoComplete="current-password"
              inputRef={password_ref}
              required
              error={password_empty.status}
              helperText={password_empty.message}
              onChange={() => {
                setPasswordEmpty({
                  status: false,
                  message: null,
                });
                setLoginFail({ status: false, message: null });
              }}
            />
            <Button variant="contained" type="submit">
              Đăng nhập
            </Button>
          </Box>
          <Typography variant="body2">
            Sản phẩm của nhóm Nhà !thông minh - CO3111 - HK232
          </Typography>
        </Box>
      </Stack>
    </>
  );
}
