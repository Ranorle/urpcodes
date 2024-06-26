import React from 'react';
import './App.css';
import {RouterProvider,createBrowserRouter,Outlet,useLocation,useNavigate } from "react-router-dom";
import { Provider } from 'mobx-react';
import Stores from "../../store/store";
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ComputerIcon from '@material-ui/icons/Computer';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import HomeIcon from '@material-ui/icons/Home';
import {AppuseStyles} from './Appstyle'
import {ThemeProvider,createTheme } from "@material-ui/core/styles";
import Calculate from "../calculate/calculate";
import Homepage from "../homepage/homepage";

const Layout:React.FC =()=>{
  const classes = AppuseStyles();
  const [open, setOpen] = React.useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
      <div className={classes.root2}>
        <CssBaseline />
        <AppBar
            position="fixed"
            className={clsx(classes.appBar)}
        >
          <Toolbar>
            <Typography variant="h6" noWrap>
                {location.pathname === '/' && '首页/Home'}
                {location.pathname === '/singleCalculate' && '单建筑计算界面/singleCalculate'}
                {location.pathname === '/charts' && '图表分析/charts'}

            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
            onMouseEnter={handleDrawerOpen}
            onMouseLeave={handleDrawerClose}
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
        >
          <div className={classes.toolbar}/>
          <Divider />
          <List>
              <ListItem className={classes.DrawerText} button onClick={()=>{navigate('/');}}>
                          <ListItemIcon><HomeIcon /></ListItemIcon>
                      <ListItemText  primary="首页" />
                  </ListItem>
                <ListItem className={classes.DrawerText} button onClick={()=>{navigate('/singleCalculate');}}>
                  <ListItemIcon><ComputerIcon /></ListItemIcon>
                  <ListItemText  primary="单建筑计算界面" />
                </ListItem>
              <ListItem className={classes.DrawerText} button onClick={()=>{navigate('/charts');}}>
                  <ListItemIcon><EqualizerIcon/></ListItemIcon>
                  <ListItemText  primary="图表分析" />
              </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Outlet/>
        </main>
      </div>
  );
}

const router=createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
        {
          path:"/",
          element:Homepage
        },
      {
        path:"/singleCalculate",
        element:<Calculate/>
      },
        {
            path:"/charts",
            element:<div>charts</div>
        },
    ]
  },
])

function App() {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#3a8ee6', // 设置主要颜色为浅蓝色
            },

        },
    });
    return (
      <Provider counterStore={Stores}>
          <ThemeProvider theme={theme}>
      <div className="App">
    <RouterProvider router={router}/>
    </div>
          </ThemeProvider>
      </Provider>
  );
}

export default App;
