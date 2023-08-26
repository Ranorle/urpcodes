import React from 'react';
import './App.css';
import {RouterProvider,createHashRouter,Outlet} from "react-router-dom";
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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {AppuseStyles} from './Appstyle'
import {useTheme,ThemeProvider } from "@material-ui/core/styles";

const Layout:React.FC =()=>{
  const classes = AppuseStyles();
  const [open, setOpen] = React.useState<boolean>(false);

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
              Mini variant drawer
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
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
            {['Calculate', 'Settings'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>{index === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Outlet/>
        </main>
      </div>
  );
}

const router=createHashRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
      {
        path:"/calculate",
        element:<div>666</div>
      }
    ]
  },
])

function App() {

    const theme = useTheme();

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
