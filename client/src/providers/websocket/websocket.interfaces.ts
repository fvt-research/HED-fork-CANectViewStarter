export interface WebsocketMessage
{
	DataType: string
	MGPID: number
	MGPLabel: string
	MGPName: string
	ParamVal: any
	Timestamp: string
	MGPVals?:Array<any>
}