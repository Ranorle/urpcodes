import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
const drawerWidth = 240;


export const AppuseStyles = makeStyles((theme: Theme) =>
    createStyles({
        root2: {
            backgroundColor:"#f8f9fa",
            display: 'flex',
        },
        DrawerText:{
            color: "black",
            textDecoration:"none"
        },
        appBar: {
            backgroundColor:"#409eff",
            color:"white",
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            boxShadow:'0 2px 4px rgba(0, 0, 0, 0.2)',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(8),
            },
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        content: {
            overflowY:"auto",
            height:"100vh",
            backgroundColor:"#f8f9fa",
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }),
);