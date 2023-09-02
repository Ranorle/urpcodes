import { Map, ScaleControl, ToolBarControl,Marker  } from '@uiw/react-amap';
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
import * as echarts from 'echarts';
import {toJS} from "mobx";
import dayjs from 'dayjs';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


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
        title:{
            textAlign:"left",
            fontSize:25,
            fontWeight:500,
            marginBottom:10,
        },
        epwroot:{
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"left",
            marginBottom:30,
        },
        showingdiv:{
            display:"flex",
            flexDirection:"row",
            justifyContent:"center",
            alignItems:"center",
            gap:70,
        },alldiv:{
            marginTop:30,
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center",
            gap:40,
        },ganluChart:{
            width:750,
            height:400,
            borderRadius:10,
            paddingTop:30,
            paddingBottom:20,
            boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
            '&:hover': {
                boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.3)',
            },
        },table: {
            minWidth: 650,
        },basetitle:{
            textAlign:"left",
            height:40 ,
            fontSize:25,
            fontWeight:500,
            justifyContent:"center",
            marginLeft:15,
            marginTop:10,
        }
    }),
);

const findMaxAndMinAndAver=(array:number[])=>{
    const maxvalue = Math.max(...array);
    const maxIndex = array.indexOf(maxvalue);
    const minvalue = Math.min(...array);
    const minIndex = array.indexOf(minvalue)
    const startDate = dayjs('2023-01-01'); // 设置你的起始日期
    const Maxdate=startDate.add(maxIndex, 'hours')
    const Mindate=startDate.add(minIndex, 'hours')

    const sum = array.reduce((acc, currentValue) => acc + currentValue, 0);
    const average = sum / array.length;

    return[maxvalue.toFixed(2),minvalue.toFixed(2),average.toFixed(2),Maxdate.format('MMM D HH:mm'),Mindate.format('MMM D HH:mm')]
}
const EpwSelector=observer(()=>{
    const classes = useStyles();
    const epwStore=RootStore.epwStore

    //获取天气基本信息
    const getIdfInfo=async ()=>{
        try{
            await axios.get(httpInfo+'/selectWeather').then((e)=>{
                const x= e.data
                for (let i = 0; i < x.length; i++) {
                    x[i].Id = i + 1;
                }
                epwStore.changeepwArray(x)
            })
        }catch (err){
            console.log(err)
        }
    }

    //获取复杂信息
    const getdataInfo=async ()=>{
       if(RootStore.epwStore.epwObject.EpwName) try {
            await axios.post(httpInfo+'/getpreviewinfo',{
                epwname:RootStore.epwStore.epwObject.EpwName
            }).then((x)=>{
                RootStore.epwStore.changedry_bulb_temperature_day(x.data)
            })
        }catch (err){
            console.log(err)
        }
    }
    const dry_bulb_temperature= RootStore.epwStore.epwpreviewobject.dry_bulb_temperature.split(',').map((str) => parseFloat(str))
    const dew_point_temperature= RootStore.epwStore.epwpreviewobject.dew_point_temperature.split(',').map((str) => parseFloat(str))
    const relative_humidity= RootStore.epwStore.epwpreviewobject.relative_humidity.split(',').map((str) => parseFloat(str))
    const atmospheric_pressure= RootStore.epwStore.epwpreviewobject.atmospheric_pressure.split(',').map((str) => parseFloat(str))
    const wind_speed= RootStore.epwStore.epwpreviewobject.wind_speed.split(',').map((str) => parseFloat(str))

    const dry=findMaxAndMinAndAver(dry_bulb_temperature)
    const dew=findMaxAndMinAndAver(dew_point_temperature)
    const rel=findMaxAndMinAndAver(relative_humidity)
    const atm=findMaxAndMinAndAver(atmospheric_pressure)
    const win=findMaxAndMinAndAver(wind_speed)

    console.log(dew[4])

    const simpleRows=[
        {
            name:"干球温度(°C)",
            average:dry[2],
            max:dry[0],
            min:dry[1],
        },
        {
            name:"露点温度(°C)",
            average:dew[2],
            max:dew[0],
            min:dew[1],
        },
        {
            name:"大气压力(pa)",
            average:atm[2],
            max:atm[0],
            min:atm[1],
        },
        {
            name:"相对湿度(%)",
            average:rel[2],
            max:rel[0],
            min:rel[1],
        },
        {
            name:"风速(m/s)",
            average:win[2],
            max:win[0],
            min:win[1],
        },
    ]
    const convertIntoDay=(data:number[])=>{
        const daysData = [];
        for (let i = 0; i < data.length; i += 24) {
            const daySlice = data.slice(i, i + 24);
            daysData.push(daySlice);
        }
        const dailyAverages = daysData.map(day => {
            const sum = day.reduce((acc, value) => acc + value, 0);
            return sum / day.length;
        });
        return dailyAverages
    }

    let base = +new Date(1968, 0, 0);
    let oneDay = 24 * 3600 * 1000;
    let date:string[] = [];

    for (let i = 0; i < 365; i++) {
        var now = new Date((base += oneDay));
        date.push([now.getMonth() + 1, now.getDate()].join('月')+'日');
    }

    //干、露温度图表option
    useEffect(()=>{
        // 绘制图表
       if(RootStore.epwStore.epwObject.Id!==0) {
           const myChart = echarts.init(document.getElementById('ganluChart'));
           myChart.setOption({
               tooltip: {
                   trigger: 'axis', // 设置触发 tooltip 的方式，'axis' 表示在坐标轴上触发
                   position: function (pt:string) {
                       return [pt[0], '10%']; // 设置 tooltip 显示位置
                   },
                   formatter: function (params: any[]) {
                       // 自定义 tooltip 的内容
                       const date = params[0].name; // 获取 X 轴的日期
                       let value1='null'
                       let value2='null'
                       if(params[0]) value1 = params[0].value.toFixed(2); // 获取对应的数据值
                       if(params[1]) value2 = params[1].value.toFixed(2); // 获取对应的数据值

                       return `日期：${date}<br />干球日均温度：${value1}<br />露点日均温度：${value2}`; // 返回自定义的 tooltip 内容
                   },
               },
               title: {
                   text: '温度数据', // 主标题文本
                   left: '6%', // 主标题距离左侧的位置，可以根据需要调整
                   top: 'top', // 主标题位于图表顶部
                   textStyle: {
                       // 标题文本样式
                       fontSize: 20, // 主标题字体大小
                       fontWeight: 'bold', // 主标题字体粗细
                       color: '#333', // 主标题颜色
                   },
               },
               legend: {
                   data: ['干球日均温度', '露点日均温度'], // 图例中显示的标签
               },
               xAxis: {
                   type: 'category',
                   boundaryGap: false,
                   data: date
               },
               yAxis: {
                   name: '温度/℃',
               },
               series: [
                   {
                       name:"干球日均温度",
                       data: convertIntoDay(dry_bulb_temperature),
                       type: 'line',
                       smooth: true
                   },
                   {
                       name:"露点日均温度",
                       data: convertIntoDay(dew_point_temperature),
                       type: 'line',
                       smooth: true,
                   }
               ],
               dataZoom: [
                   {
                       type: 'inside',
                       start: 0,
                       end: 365
                   },
                   {
                       start: 0,
                       end: 365
                   }
               ],
           });
       }
    },[RootStore.epwStore.epwpreviewobject])

    useEffect(()=>{
        getIdfInfo()
    },[])
    useEffect(()=>{
        getdataInfo()
    },[RootStore.epwStore.epwObject.EpwName])

    const handleChange = (event: React.ChangeEvent<{ value:unknown }>) => {

        epwStore.changeepwObject(epwStore.epwArray[Number(event.target.value)-1])
    };

    // console.log(toJS(epwStore.epwArray))

    const MenuItems=()=>{
        return epwStore.epwArray.map((prop) => {
            return <MenuItem key={prop.Id} value={prop.Id}>{prop.EpwName}</MenuItem>
        })
    }



    return (
        <div className={classes.sceneSelectorDiv}>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-helper-label">选择气象数据</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={epwStore.epwObject.Id}
                    onChange={handleChange}
                >
                    {MenuItems()}
                </Select>
            </FormControl>
            {RootStore.epwStore.epwObject.Id!==0 &&
                <div className={classes.alldiv}>
                <div className={classes.showingdiv}>
                    <div>
                        <TableContainer component={Paper}>
                            <div className={classes.basetitle}>基本数据</div>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>数据信息</TableCell>
                                        <TableCell align="right">年均数据</TableCell>
                                        <TableCell align="right">最高数据</TableCell>
                                        <TableCell align="right">最低数据</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {simpleRows.map((row) => {
                                        if (row) return <TableRow key={row.name}>
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.average}</TableCell>
                                            <TableCell align="right">{row.max}</TableCell>
                                            <TableCell align="right">{row.min}</TableCell>
                                        </TableRow>
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className={classes.epwroot}>
                <div className={classes.title}>地图地点预览(经纬度:{RootStore.epwStore.epwObject.Location})</div>
                <Map zoom={4} center={epwStore.epwObject.Location.split(',')} style={{
                    borderRadius:6,
                    height: 350,
                    width: 500,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
                }}>
                <>
                    <ScaleControl offset={[16, 30]} position="LB"/>
                    <ToolBarControl offset={[16, 10]} position="RB"/>
                    <Marker
                        position={epwStore.epwObject.Location.split(',')}
                    />
                </>
            </Map>
            </div>
            </div>
                <div className={classes.showingdiv}>
                    <div id="ganluChart" className={classes.ganluChart}></div>
                </div>
                </div>}
        </div>


    );
})
export default EpwSelector
