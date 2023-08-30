package types

//数据库基本信息

type BaseInfoType struct {
	Id              int
	EnergyPlusExec  string
	OutputDirectory string
}

//IDF数据库类型

type IdfTableType struct {
	Id      int
	IdfName string
	IdfPath string
	// 继续为表中的每个字段添加相应的字段类型
}

//EPW数据库类型

type EpwTableType struct {
	Id      int
	EpwName string
	EpwPath string
	// 继续为表中的每个字段添加相应的字段类型
}

//websocket基本input

type InputParams struct {
	IDFPath     string `json:"IDFPath"`
	EPWPath     string `json:"EPWPath"`
	ChangeDatas []any  `json:"ChangeDatas"`
}

//
//type SetRunPeriod struct {
//	Handletype      string `json:"Handletype"`
//	RunPeroidName   string `json:"RunPeroidName"`
//	BeginMonth      string `json:"BeginMonth"`
//	BeginDayOfMonth string `json:"BeginDayOfMonth"`
//	EndMonth        string `json:"EndMonth"`
//	EndDayOfMonth   string `json:"EndDayOfMonth"`
//}
//
//type AddRunPeriod struct {
//	Handletype      string `json:"Handletype"`
//	Addnumber       string `json:"Addnumber"`
//	RunPeroidName   string `json:"RunPeroidName"`
//	BeginMonth      string `json:"BeginMonth"`
//	BeginDayOfMonth string `json:"BeginDayOfMonth"`
//	EndMonth        string `json:"EndMonth"`
//	EndDayOfMonth   string `json:"EndDayOfMonth"`
//}
