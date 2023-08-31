import React, {useEffect} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { observer } from "mobx-react-lite";
import RootStore from '../store/store'
import axios from "axios";
import httpInfo from "../http/httpinfo";
// import {toJS} from "mobx";
import { Map, APILoader, ScaleControl, ToolBarControl,Marker  } from '@uiw/react-amap';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: '60%',

        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        sceneSelectorDiv:{
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center"
        },
    }),
);


const EpwSelector=observer(()=>{
    const classes = useStyles();
    const epwStore=RootStore.epwStore
    useEffect(()=>{
        const getIdfInfo=()=>{
            try{
                axios.get(httpInfo+'/selectWeather').then((e)=>{
                    epwStore.changeepwArray(e.data)
                })
            }catch (err){
                console.log(err)
            }
        }
        getIdfInfo()
    },[])

    const handleChange = (event: React.ChangeEvent<{ value:unknown }>) => {

        epwStore.changeepwObject(epwStore.epwArray[Number(event.target.value)-1])
    };

    const MenuItems=()=>{
        return epwStore.epwArray.map((prop) => {
            return <MenuItem key={prop.Id} value={prop.Id}>{prop.EpwName}</MenuItem>
        })
    }

    // console.log(toJS(epwStore.epwObject))
    // @ts-ignore
    return (
        <div className={classes.sceneSelectorDiv}>
            <FormControl className={classes.formControl}>
                <InputLabel  id="demo-simple-select-helper-label">选择场景</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={epwStore.epwObject.Id}
                    onChange={handleChange}
                >
                    {MenuItems()}
                </Select>
            </FormControl>
            <APILoader akey="7e24327564801cafa1077cf3f420bddf">
            <Map style={{ height: 500 ,width:500}}>
                <>
                <ScaleControl offset={[16, 30]} position="LB" />
                <ToolBarControl offset={[16, 10]} position="RB" />
                    <Marker
                        icon={new window.AMap.Icon({
                            imageSize: new window.AMap.Size(25, 34),
                            image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-2.png'
                        })}
                        offset={new window.AMap.Pixel(-13, -30)}
                        position={[116.368904, 39.913423]}
                    />
                </>
            </Map>
            </APILoader>
        </div>


    );
})
export default EpwSelector
