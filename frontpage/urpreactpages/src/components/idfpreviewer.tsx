import React from "react";
import Card from '@material-ui/core/Card';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from "@material-ui/core/Button";
import axios from "axios";
import httpInfo from "../http/httpinfo";
import RootStore from "../store/store";
type ChildComponentProps ={
    idfname: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        previewroot:{
            display:"flex",
            flexDirection:"row",
            justifyContent:"center",
            alignItems:"center",
            marginBottom:30,
        },
        previewcard: {
            width: 550,
            height:450,
            paddingLeft:50,
            paddingRight:50,
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
            '&:hover': {
                boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.3)',
            },
        },
        media: {
            height:'100%',
            width:"100%",
        },
        title:{
            textAlign:"left",
            fontSize:25,
            fontWeight:500,
            marginBottom:10,
        },
        setdiv:{
            height:400,
            marginTop:35,
            display:"flex",
            flexDirection:"row",
            gap:40,
            marginLeft:80,
        }
    }),
);
const Idfpreviewer:React.FC<ChildComponentProps>=(props)=>{
    const classes = useStyles();
    const [value, setValue] = React.useState<string>('iso');
    const [mode, setMode] = React.useState<string>('normal');
    const previewOnclick=async (value:string,mode:string)=>{
       await axios.post(httpInfo+"/windowpreview",{
            value:value,
            mode:mode,
           InputidfFilePath:RootStore.idfStore.idfObject.IdfPath,
        }).then((res)=>{
            console.log(res.data)
           }
       )
    }

    return<div>
        {props.idfname &&<div className={classes.previewroot}>
            <div><div className={classes.title}>场景模型预览</div>
            <Card className={classes.previewcard}>
             <CardMedia
                className={classes.media}
                image={`http://localhost:10088/idfpreview/${props.idfname}.idf/${mode}/${value}.png`}
                title="Paella dish"
            />
        </Card></div>
            <div>
        <div className={classes.setdiv}>
            <FormControl component="fieldset">
                <FormLabel component="legend">预览外观模式</FormLabel>
                <RadioGroup aria-label="position" name="预览方位" value={mode} onChange={(event)=>{setMode((event.target as HTMLInputElement).value)}}>
                    <FormControlLabel value="normal" control={<Radio />} label="正常" />
                    <FormControlLabel value="x-ray" control={<Radio />} label="透视" />
                    <FormControlLabel value="zone" control={<Radio />} label="区域划分" />
                    <FormControlLabel value="surface_type" control={<Radio />} label="构建表面" />
                    <FormControlLabel value="boundary" control={<Radio />} label="外部边界条件" />
                    <FormControlLabel value="space" control={<Radio />} label="空间划分" />
                    <FormControlLabel value="construction" control={<Radio />} label="表面构造" />

                </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
            <FormLabel component="legend">预览方位</FormLabel>
            <RadioGroup aria-label="position" name="预览方位" value={value} onChange={(event)=>{setValue((event.target as HTMLInputElement).value)}}>
                <FormControlLabel value="iso" control={<Radio />} label="立体图" />
                <FormControlLabel value="front" control={<Radio />} label="前视图" />
                <FormControlLabel value="back" control={<Radio />} label="后视图" />
                <FormControlLabel value="top" control={<Radio />} label="顶视图" />
                <FormControlLabel value="left" control={<Radio />} label="左视图" />
                <FormControlLabel value="right" control={<Radio />} label="右视图" />
            </RadioGroup>
        </FormControl>
        </div>
                <Button style={{marginLeft:"50px"}} variant="contained" color="primary" onClick={()=>{previewOnclick(value,mode)}}>
                    点击在新窗口中操作
                </Button>
            </div>

        </div>}
    </div>
}

export default Idfpreviewer