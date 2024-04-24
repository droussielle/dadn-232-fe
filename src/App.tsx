import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

import ClippedDrawer from './components/drawer';
import MenuAppBar from './components/navbar';
import HomePage from './pages/Home/home';
import { LoginPage } from './pages/Login';

function App() {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <MenuAppBar />
        <ClippedDrawer />
        <HomePage />
      </Box>
    </>
  );
}

export default App;
