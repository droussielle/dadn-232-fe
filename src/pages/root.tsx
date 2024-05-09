import { Outlet } from 'react-router-dom';

// import getDevice from '../components/deviceCard';
import ClippedDrawer from '../components/drawer';
import MenuAppBar from '../components/navbar';

export default function Root() {
  return (
    <>
      <MenuAppBar />
      <ClippedDrawer />
      <div id="detail" style={{ marginTop: '96px' }}>
        <Outlet />
      </div>
    </>
  );
}

// export async function loader({ params }) {
//   const device = await getDevice(params.deviceID);
//   return { device };
// }
