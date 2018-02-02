export const PARAM_GROUP:string = 'Accelerometer';
export const MAX_RATE:number = 100;
export const MIN_RATE:number = 1000;

export const convertTilt = (rawValue:number):string => {
	rawValue += 90;
	if (rawValue > 180) {
		rawValue -= 180;
	}
	return rawValue.toString();
};

export const convertAccel = (rawValue:number):string => {
	let converted = (rawValue / 1024) * 9.81;
	return converted.toFixed(2);
};