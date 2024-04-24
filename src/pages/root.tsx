import { Outlet } from 'react-router-dom';

import ClippedDrawer from '../components/drawer';
import MenuAppBar from '../components/navbar';

export default function Root() {
  return (
    <>
      <MenuAppBar />
      <ClippedDrawer />
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
