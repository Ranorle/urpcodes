import {Map, Marker, ScaleControl, ToolBarControl} from '@uiw/react-amap';
import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {observer} from "mobx-react-lite";
import RootStore from '../store/store'
import axios from "axios";
import httpInfo from "../http/httpinfo";
import * as echarts from 'echarts';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {data} from "browserslist";


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
            gap:60,
        },alldiv:{
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center",
            gap:30,
        },ganluChart:{
            width:650,
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
        },
        avaragedifferenceChart:{
            width:500,
            height:400,
            borderRadius:10,
            boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
            '&:hover': {
                boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.3)',
            },
        }
    }),
);

const findMaxAndMinAndAver=(array:number[])=>{
    const maxvalue = Math.max(...array);
    const minvalue = Math.min(...array);

    const sum = array.reduce((acc, currentValue) => acc + currentValue, 0);
    const average = sum / array.length;

    return[maxvalue.toFixed(2),minvalue.toFixed(2),average.toFixed(2)]
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
    const wind_direction= RootStore.epwStore.epwpreviewobject.wind_direction.split(',').map((str) => parseFloat(str))

    const dry=findMaxAndMinAndAver(dry_bulb_temperature)
    const dew=findMaxAndMinAndAver(dew_point_temperature)
    const rel=findMaxAndMinAndAver(relative_humidity)
    const atm=findMaxAndMinAndAver(atmospheric_pressure)
    const win=findMaxAndMinAndAver(wind_speed)




    //风向转换函数
    function convertWindDirections(degreesArray:number[]) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

        return degreesArray.map(degrees => {
            const index = Math.round(degrees / 22.5) % 16;
            return directions[index];
        });
    }

    //数据表格
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

    //每日平均温度
    const convertIntoDay=(data:number[])=>{
        const daysData = [];
        for (let i = 0; i < data.length; i += 24) {
            const daySlice = data.slice(i, i + 24);
            daysData.push(daySlice);
        }
        return daysData.map(day => {
            const sum = day.reduce((acc, value) => acc + value, 0);
            return sum / day.length;
        })
    }

    const convertIntoDay_wind = (windSpeedData:number[], windDirectionData:number[]) => {
        const daysData = [];
        const hoursPerDay = 24;

        for (let i = 0; i < windSpeedData.length; i += hoursPerDay) {
            const dayWindSpeedSlice = windSpeedData.slice(i, i + hoursPerDay);
            const dayWindDirectionSlice = windDirectionData.slice(i, i + hoursPerDay);
            daysData.push({ windSpeed: dayWindSpeedSlice, windDirection: dayWindDirectionSlice });
        }

        const calculateWeight = (windSpeed:number) => Math.pow(windSpeed, 2);

        return daysData.map(day => {
            const weightedSumSpeed = day.windSpeed.reduce((acc, speed, index) => {
                const weight = calculateWeight(speed);
                return acc + (speed * weight);
            }, 0);

            const weightedSumDirectionX = day.windSpeed.reduce((acc, speed, index) => {
                const weight = calculateWeight(speed);
                return acc + (speed * Math.cos(day.windDirection[index]) * weight);
            }, 0);

            const weightedSumDirectionY = day.windSpeed.reduce((acc, speed, index) => {
                const weight = calculateWeight(speed);
                return acc + (speed * Math.sin(day.windDirection[index]) * weight);
            }, 0);

            const totalWeight = day.windSpeed.reduce((acc, speed, index) => {
                const weight = calculateWeight(speed);
                return acc + weight;
            }, 0);

            const weightedAverageSpeed = weightedSumSpeed / totalWeight;
            const weightedAverageDirection = Math.atan2(weightedSumDirectionY, weightedSumDirectionX);

            // Convert radians to degrees for wind direction
            const weightedAverageDirectionDegrees = (weightedAverageDirection * 180) / Math.PI;

            return weightedAverageDirectionDegrees;
        });
    }

    //每日最大温差
    let base = +new Date(1968, 0, 0);
    let oneDay = 24 * 3600 * 1000;
    let date:string[] = [];

    for (let i = 0; i < 365; i++) {
        const now = new Date((base += oneDay));
        date.push([now.getMonth() + 1, now.getDate()].join('月')+'日');
    }

    const day_windspeed_data=convertIntoDay(wind_speed)
    const day_winddirection_data=convertIntoDay_wind(wind_speed,wind_direction)

    const wind_speed_data = day_windspeed_data.map((value, index) => {
        // 计算时间戳，从2023年1月1日0时开始，每小时递增
        const timestamp = new Date('2023-01-01').getTime() +  index *  24 * 60 * 60 * 1000;

        return {
            time: new Date(timestamp).toISOString(), // 将时间转换为字符串
            windSpeed: value,
            R: convertWindDirections(day_winddirection_data)[index], // 假设您有一个名为convertWindDirections的函数来获取R值
        };
    });

    const calculateAnnualAverageMaxTemperatureDifference = (data:number[]) => {
        const daysData = [];
        for (let i = 0; i < data.length; i += 24) {
            const daySlice = data.slice(i, i + 24);
            daysData.push(daySlice);
        }

        const dailyMaxDifferences = daysData.map((day) => {
            const maxTemp = Math.max(...day);
            const minTemp = Math.min(...day);
            return maxTemp - minTemp;
        });

        return dailyMaxDifferences.reduce((acc, maxDifference) => acc + maxDifference, 0) /
            dailyMaxDifferences.length;
    };



    const averageatm: number = parseFloat(simpleRows[2].average)/1000;


    const y={
    "data": wind_speed_data
}

    //干、露温度图表option
    useEffect(()=>{
        // 绘制图表
       if(RootStore.epwStore.epwObject.Id!==0) {
           const ganluChart = echarts.init(document.getElementById('ganluChart'));
           ganluChart.setOption({
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

           const avaragedifferenceChart =echarts.init(document.getElementById('avaragedifferenceChart'))
           avaragedifferenceChart.setOption({
               series: [
                   {
                       type: 'gauge',
                       center: ['50%', '60%'],
                       startAngle: 200,
                       endAngle: -20,
                       min: 0,
                       max: 60,
                       splitNumber: 12,
                       itemStyle: {
                           color: '#FFAB91'
                       },
                       progress: {
                           show: true,
                           width: 30
                       },

                       pointer: {
                           show: false
                       },
                       axisLine: {
                           lineStyle: {
                               width: 30
                           }
                       },
                       axisTick: {
                           distance: -45,
                           splitNumber: 5,
                           lineStyle: {
                               width: 2,
                               color: '#999'
                           }
                       },
                       splitLine: {
                           distance: -52,
                           length: 14,
                           lineStyle: {
                               width: 3,
                               color: '#999'
                           }
                       },
                       axisLabel: {
                           distance: -20,
                           color: '#999',
                           fontSize: 20
                       },
                       anchor: {
                           show: false
                       },
                       title: {
                           show: false
                       },
                       detail: {
                           valueAnimation: true,
                           width: '60%',
                           lineHeight: 40,
                           borderRadius: 8,
                           offsetCenter: [0, '-15%'],
                           fontSize: 60,
                           fontWeight: 'bolder',
                           formatter: '{value} °C',
                           color: 'inherit'
                       },
                       data: [
                           {
                               value: calculateAnnualAverageMaxTemperatureDifference(dry_bulb_temperature).toFixed(1)
                           }
                       ]
                   },

                   {
                       type: 'gauge',
                       center: ['50%', '60%'],
                       startAngle: 200,
                       endAngle: -20,
                       min: 0,
                       max: 60,
                       itemStyle: {
                           color: '#FD7347'
                       },
                       progress: {
                           show: true,
                           width: 8
                       },

                       pointer: {
                           show: false
                       },
                       axisLine: {
                           show: false
                       },
                       axisTick: {
                           show: false
                       },
                       splitLine: {
                           show: false
                       },
                       axisLabel: {
                           show: false
                       },
                       detail: {
                           show: false
                       },
                       data: [
                           {
                               value: calculateAnnualAverageMaxTemperatureDifference(dry_bulb_temperature).toFixed(2)
                           }
                       ]
                   }
               ],
               title: {
                   text: '平均日最大温差(干球)', // 主标题文本
                   left: 'center', // 主标题距离左侧的位置，
                   top: 'bottom', // 主标题位于图表顶部
                   textStyle: {
                       // 标题文本样式
                       fontSize: 20, // 主标题字体大小
                       fontWeight: 'bold', // 主标题字体粗细
                       color: '#333', // 主标题颜色
                   },
               },
           })
           //风速风向图表
           const fengsuchart=(response: { data: { time: string; windSpeed: number; R: string; }[]; }) => {
                   const rawData = response

                   const directionMap = {};
                   // prettier-ignore
                   [
                       'W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE',
                       'N', 'NNW', 'NW', 'WNW'
                   ].forEach(function (name, index) {
                       // @ts-ignore
                       directionMap[name] = (Math.PI / 8) * index;
                   });
                    let data
                  if(rawData.data) data = rawData.data.map(function (entry: { time: any; windSpeed: any; R: any; }) {
                       return [entry.time, entry.windSpeed, entry.R];
                   });
                   const dims = {
                       time: 0,
                       windSpeed: 1,
                       R: 2,
                       waveHeight: 3,
                       weatherIcon: 2,
                       minTemp: 3,
                       maxTemp: 4,
                   };
                   const arrowSize = 18;
                   const renderArrow = function (param: any, api: { coord: (arg0: any[]) => any; value: (arg0: number) => string | number; style: (arg0: {
                           fill: string;
                           stroke: string;
                           lineWidth: number
                       }) => any; }) {
                       const point = api.coord([api.value(dims.time), api.value(dims.windSpeed)]);

                       return {
                           type: 'path',
                           shape: {
                               pathData: 'M31 16l-15-15v9h-26v12h26v9z',
                               x: -arrowSize / 2,
                               y: -arrowSize / 2,
                               width: arrowSize,
                               height: arrowSize,
                           },
                           // @ts-ignore
                           rotation: directionMap[api.value(dims.R)],
                           position: point,
                           // @ts-ignore
                           style: api.style({
                               stroke: '#555',
                               lineWidth: 1,
                               fill: '#D33C3E'
                           }),
                       };
                   };

                   const option = {
                       title: {
                           text: '风向、风速数据',
                           left: 'center',
                       },
                       tooltip: {
                           trigger: 'axis',
                           formatter: function (params: { value: string[]; }[]) {
                               return [
                                   echarts.format.formatTime(
                                       'yyyy-MM-dd',
                                       params[0].value[dims.time]
                                   ) +
                                   ' ' +
                                   echarts.format.formatTime('hh:mm', params[0].value[dims.time]),
                                   '风速：' + params[0].value[dims.windSpeed],
                               ].join('<br>');
                           },
                       },
                       xAxis: {
                           type: 'time',
                           data: date,
                           splitLine: {
                               lineStyle: {
                                   color: '#ddd',
                               },
                           },
                       },
                       yAxis: [
                           {
                               name: '风速（节）',
                               nameLocation: 'middle',
                               nameGap: 35,
                               axisLine: {
                                   lineStyle: {
                                       color: '#666',
                                   },
                               },
                               splitLine: {
                                   lineStyle: {
                                       color: '#ddd',
                                   },
                               },
                           },
                           {
                               axisLine: { show: false },
                               axisTick: { show: false },
                               axisLabel: { show: false },
                               splitLine: { show: false },
                           },
                       ],
                       dataZoom: [
                           {
                               type: 'inside',
                               start: 0,
                               end: 10
                           },
                           {
                               start: 0,
                               end: 10
                           }
                       ],
                       series: [
                           {
                               type: 'custom',
                               renderItem: renderArrow,
                               encode: {
                                   x: dims.time,
                                   y: dims.windSpeed,
                               },

                               data: data,
                               z: 10,
                           },
                           {
                               type: 'line',
                               symbol: 'none',
                               encode: {
                                   x: dims.time,
                                   y: dims.windSpeed,
                               },
                               lineStyle: {
                                   color: '#aaa',
                                   type: 'dotted',
                               },
                               data: data,
                               z: 1,
                           },
                       ],
                   };

                   const myChart = echarts.init(document.getElementById('windSpeedandDirection'));
                   myChart.setOption(option)

               }
           fengsuchart(y)

           const avaragedatmosphereChart = echarts.init(document.getElementById('avaragedatmosphere'))
           avaragedatmosphereChart.setOption({
               series: [
                   {
                       type: 'gauge',
                       min: 80,
                       max: 120,
                       splitNumber: 10,
                       radius: '80%',
                       axisLine: {
                           lineStyle: {
                               color: [[1, '#f00']],
                               width: 3
                           }
                       },
                       splitLine: {
                           distance: -18,
                           length: 18,
                           lineStyle: {
                               color: '#f00'
                           }
                       },
                       axisTick: {
                           distance: -12,
                           length: 10,
                           lineStyle: {
                               color: '#f00'
                           }
                       },
                       axisLabel: {
                           distance: -42,
                           color: '#f00',
                           fontSize: 25
                       },
                       anchor: {
                           show: true,
                           size: 20,
                           itemStyle: {
                               borderColor: '#000',
                               borderWidth: 2
                           }
                       },
                       pointer: {
                           offsetCenter: [0, '10%'],
                           icon:
                               'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                           length: '115%',
                           itemStyle: {
                               color: '#000'
                           }
                       },
                       detail: {
                           valueAnimation: true,
                           precision: 1
                       },
                       title: {
                           offsetCenter: [0, '-50%']
                       },
                       data: [
                           {
                               value: averageatm ,
                               name: 'kpa'
                           }
                       ]
                   },
                   {
                       type: 'gauge',
                       min: 80,
                       max: 120,
                       splitNumber: 4,
                       axisLine: {
                           lineStyle: {
                               color: [[1, '#000']],
                               width: 3
                           }
                       },
                       splitLine: {
                           distance: -3,
                           length: 18,
                           lineStyle: {
                               color: '#000'
                           }
                       },
                       axisTick: {
                           distance: 0,
                           length: 10,
                           lineStyle: {
                               color: '#000'
                           }
                       },
                       axisLabel: {
                           distance: 10,
                           fontSize: 25,
                           color: '#000'
                       },
                       pointer: {
                           show: false
                       },
                       title: {
                           show: false
                       },
                       anchor: {
                           show: true,
                           size: 14,
                           itemStyle: {
                               color: '#000'
                           }
                       }
                   }
               ],
               title: {
                   text: '年平均气压', // 主标题文本
                   left: 'center', // 主标题距离左侧的位置，
                   top: 'bottom', // 主标题位于图表顶部
                   textStyle: {
                       // 标题文本样式
                       fontSize: 20, // 主标题字体大小
                       fontWeight: 'bold', // 主标题字体粗细
                       color: '#333', // 主标题颜色
                   },
               },
           })

    }},[RootStore.epwStore.epwpreviewobject])

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
                    <div id="avaragedifferenceChart" className={classes.avaragedifferenceChart}></div>
                </div>
                    <div className={classes.showingdiv} style={{marginTop:30}}>
                        <div id='windSpeedandDirection' className={classes.ganluChart}></div>
                        <div id='avaragedatmosphere' className={classes.avaragedifferenceChart}></div>
                    </div>
                </div>}
        </div>


    );
})
export default EpwSelector
