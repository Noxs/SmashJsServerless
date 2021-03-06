const smash = require("../../../../smash");
const request = require('request');
const aws4 = require('aws4');
const logger = smash.logger();
const errorUtil = smash.errorUtil();

const SUCCESS = "Success";
const FAILURE = "Failure";
const PROTOCOL = "https://";
const CONNECTION_PATH = "/@connections/";
const EXECUTE_API = "execute-api";
const SLASH = "/";
const DOT = ".";
const AWS_DOMAIN = ".amazonaws.com";

class WebSocket {
	constructor(connectionsId, websocketApiId = smash.getEnv("WEBSOCKET_API_ID"), websocketApiStage = smash.getEnv("WEBSOCKET_API_STAGE"), region = smash.getEnv("AWS_REGION")) {
		this.connectionsId = this._fromArray(connectionsId);
		for (const connection of this.connectionsId) {
			if (typeof connection.connectionId !== 'string') {
				throw new Error("First parameter of WebSocket() must be an object or an array of object, witch must contain a string called connectionId, " + errorUtil.typeOf(connection.connectionId));
			}
		}
		if (typeof websocketApiId !== 'string') {
			throw new Error("Second parameter of WebSocket() must be a string, " + errorUtil.typeOf(websocketApiId));
		}
		this.websocketApiId = websocketApiId;
		if (typeof websocketApiStage !== 'string') {
			throw new Error("Third parameter of WebSocket() must be a string, " + errorUtil.typeOf(websocketApiStage));
		}
		this.websocketApiStage = websocketApiStage;
		if (typeof region !== 'string') {
			throw new Error("Fourth parameter of WebSocket() must be a string, " + errorUtil.typeOf(region));
		}
		this.region = region;
	}

	getPath(connectionId) {
		return SLASH + this.websocketApiStage + CONNECTION_PATH + connectionId;
	}

	getHost() {
		return this.websocketApiId + DOT + EXECUTE_API + DOT + this.region + AWS_DOMAIN;
	}

	postToConnection(params) {
		return new Promise((resolve, reject) => {
			const host = this.getHost();
			const signature = this._sign('POST', host, params.connectionId, params.data);
			const url = PROTOCOL + host + signature.path;
			request.post({ url, headers: signature.headers, json: true, body: params.data }, (error, response, body) => {
				if (error) {
					logger.error("Failed to post message to connection " + params.connectionId, error);
					reject(error);
				} else {
					if (response.statusCode === 200) {
						resolve(response);
					} else {
						reject(response);
					}
				}
			});
		});
	}

	disconnectConnection(params) {
		return new Promise((resolve, reject) => {
			const host = this.getHost();
			const signature = this._sign('DELETE', host, params.connectionId);
			const url = PROTOCOL + host + signature.path;
			request.delete({ url, headers: signature.headers, json: true }, (error, response, body) => {
				if (error) {
					logger.error("Failed to post message to connection " + params.connectionId, error);
					reject(error);
				} else {
					if (response.statusCode === 204) {
						resolve(response);
					} else {
						reject(response);
					}
				}
			});
		});
	}

	_disconnectOneConnection(connectionId) {
		return new Promise(resolve => {
			this.disconnectConnection({ connectionId }).then(data => {
				resolve({ connectionId, status: SUCCESS, data });
			}).catch(error => {
				resolve({ connectionId, status: FAILURE, error });
			});
		});
	}

	getConnectionStatus(params) {
		return new Promise((resolve, reject) => {
			const host = this.getHost();
			const signature = this._sign('GET', host, params.connectionId);
			const url = PROTOCOL + host + signature.path;
			request.get({ url, headers: signature.headers, json: true }, (error, response, body) => {
				if (error) {
					logger.error("Failed to post message to connection " + params.connectionId, error);
					reject(error);
				} else {
					if (response.statusCode === 200) {
						resolve(body);
					} else {
						reject(response);
					}
				}
			});
		});
	}

	_sign(method, host, connectionId, body = null) {
		const requestToSign = {
			host,
			region: this.region,
			service: EXECUTE_API,
			method,
			path: this.getPath(connectionId),
			headers: {
				'Content-Type': 'application/json',
			},
		};
		if (body) {
			requestToSign.body = JSON.stringify(body);
		}
		return aws4.sign(requestToSign);
	}

	_getOneConnectionStatus(connectionId) {
		return new Promise(resolve => {
			this.getConnectionStatus({ connectionId }).then(data => {
				resolve({ connectionId, status: SUCCESS, data });
			}).catch(error => {
				resolve({ connectionId, status: FAILURE, error });
			});
		});
	}

	_fromArray(array) {
		if (Array.isArray(array)) {
			return array;
		}
		return [array];
	}

	disconnect() {
		return new Promise((resolve, reject) => {
			const promises = this.connectionsId.map(({ connectionId }) => this.disconnectConnection({ connectionId }));
			Promise.all(promises).then(resolve).catch(reject);
		});
	}

	_sendMessageToOneConnection(connectionId, action, body) {
		return new Promise(resolve => {
			const params = {
				connectionId,
				data: JSON.stringify({ action, body }),
			};
			this.postToConnection(params).then(data => {
				resolve({ connectionId, status: SUCCESS, data });
			}).catch(error => {
				resolve({ connectionId, status: FAILURE, error });
			});
		});
	}

	emit(action, body) {
		return new Promise((resolve, reject) => {
			const promises = this.connectionsId.map(({ connectionId }) => this._sendMessageToOneConnection(connectionId, action, body));
			Promise.all(promises).then(resolve).catch(reject);
		});
	}

	status() {
		return new Promise((resolve, reject) => {
			const promises = this.connectionsId.map(({ connectionId }) => this._getOneConnectionStatus(connectionId));
			Promise.all(promises).then(resolve).catch(reject);
		});
	}
}

module.exports = WebSocket;
