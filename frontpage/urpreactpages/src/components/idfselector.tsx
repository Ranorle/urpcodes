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
import {toJS} from "mobx";

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


const IdfSelector=observer(()=>{
    const classes = useStyles();
    const idfStore=RootStore.idfStore
    useEffect(()=>{
        const getIdfInfo=()=>{
            try{
                axios.get(httpInfo+'/selectScene').then((e)=>{
                    idfStore.changeidfArray(e.data)
                })
            }catch (err){
                console.log(err)
            }
        }
        getIdfInfo()
    },[])

    const handleChange = (event: React.ChangeEvent<{ value:unknown }>) => {

            idfStore.changeidfObject(idfStore.idfArray[Number(event.target.value)-1])
    };

    const MenuItems=()=>{
        return idfStore.idfArray.map((prop) => {
            return <MenuItem key={prop.Id} value={prop.Id}>{prop.IdfName}</MenuItem>
        })
    }

    console.log(toJS(idfStore.idfObject))
    return (
        <div className={classes.sceneSelectorDiv}>
            <FormControl className={classes.formControl}>
                <InputLabel  id="demo-simple-select-helper-label">选择场景</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={idfStore.idfObject.Id}
                    onChange={handleChange}
                >
                    {MenuItems()}
                </Select>
            </FormControl>
        </div>
    );
})
export default IdfSelector
