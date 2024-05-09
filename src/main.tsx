import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Box } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ActivityLogTable from './components/ActivityLogTable';
import SensorChartB from './components/SensorChart';
import DeviceInfo, { loader as deviceLoader } from './pages/deviceInfo';
import DevicesList from './pages/devices';
import ErrorPage from './pages/error';
import HomePage from './pages/home';
import LoginPage from './pages/login';
// import App from './App';
import Root from './pages/root';
import DeviceActivity from './components/DeviceActivity';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root'),
// );

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Root />
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: 'devices/:deviceID',
        element: <DeviceInfo />,
        loader: deviceLoader,
      },
      {
        path: 'devices',
        element: <DevicesList />,
      },
      {
        path: 'report',
        element: (
          <Box sx={{ marginLeft: 32 }}>
            <SensorChartB />
            <DeviceActivity />
          </Box>
        ),
      },
      {
        path: 'history',
        element: (
          <Box sx={{ marginLeft: 32 }}>
            <ActivityLogTable />
          </Box>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
