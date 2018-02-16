import { Environment } from './environment.interface';

const getWsUrl = ():string => {
	let wsProtocol = 'ws:';
	let host = window.location.host;
	let httpProtocol = window.location.protocol;
	if (httpProtocol == 'https:') {
		wsProtocol = 'wss:';
	}
	return `${wsProtocol}//${host}/`;
};

const getApiUrl = ():string => {
	let host = window.location.host;
	let httpProtocol = window.location.protocol;
	return `${httpProtocol}//${host}/api/`;
};

export const ENV: Environment = {
	DEBUG : false,
	WS_URL : getWsUrl(),
	API_URL : getApiUrl()
};