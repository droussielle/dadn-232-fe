import HomeIcon from '@mui/icons-material/Home';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link, Outlet } from 'react-router-dom';

const drawerWidth = 240;

export default function ClippedDrawer() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {[
            ['Trang chủ', '<HomeIcon />', '/home'],
            ['Thiết bị', '', '/devices'],
            ['Thống kê', '', '/stats'],
            ['Quản trị', '', '/manage'],
          ].map((item, index) => (
            <ListItem key={item[0]} disablePadding component={Link} to={item[2]}>
              <ListItemButton>
                {/* <ListItemIcon>{item[1]}</ListItemIcon> */}
                <ListItemText primary={item[0]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {/* <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Box>
      <Box sx={{ flexGrow: 1 }}></Box>
      <Typography p={2} variant="body2">
        Sản phẩm của nhóm Nhà <br />
        !thông minh - CO3111 - HK232
      </Typography>
    </Drawer>
  );
}
