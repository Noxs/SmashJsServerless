const smash = require("../../../../smash");
const request = require('request');
const aws4 = require('aws4')
const logger = smash.logger("WebSocket");
const errorUtil = new smash.SmashError(logger);

const SUCCESS = "Success";
const FAILURE = "Failure";
const PROTOCOL = "https://";

class WebSocket {
	constructor(connectionsId) {
		this.connectionsId = this._fromArray(connectionsId);
	}

	getPath(connectionId) {
		//TODO check if env var are set correctly
		return "/" + smash.getEnv("WEBSOCKET_API_STAGE") + "/@connections/" + connectionId;
	}

	getHost() {
		//TODO check if env var are set correctly
		return smash.getEnv("WEBSOCKET_API_ID") + ".execute-api." + smash.getEnv("AWS_REGION") + ".amazonaws.com";
	}

	postToConnection(params) {
		return new Promise((resolve, reject) => {
			const host = this.getHost();
			const signature = aws4.sign({
				host,
				region: smash.getEnv("AWS_REGION"),
				service: 'execute-api',
				method: 'POST',
				path: this.getPath(params.connectionId),
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params.data),
			});
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
			const signature = aws4.sign({
				host,
				region: smash.getEnv("AWS_REGION"),
				service: 'execute-api',
				method: 'DELETE',
				path: this.getPath(params.connectionId),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const url = PROTOCOL + host + signature.path;
			request.delete({ url, headers: signature.headers, json: true }, (error, response, body) => {
				if (error) {
					logger.error("Failed to post message to connection " + params.connectionId, error);
					reject(error);
				} else {
					logger.info(response.statusCode);
					logger.info(response);
					resolve(response);
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
			const signature = aws4.sign({
				host,
				region: smash.getEnv("AWS_REGION"),
				service: 'execute-api',
				method: 'GET',
				path: this.getPath(params.connectionId),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const url = PROTOCOL + host + signature.path;
			request.delete({ url, headers: signature.headers, json: true }, (error, response, body) => {
				if (error) {
					logger.error("Failed to post message to connection " + params.connectionId, error);
					reject(error);
				} else {
					logger.info(response.statusCode);
					logger.info(response);
					resolve(response);
				}
			});
		});
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
		} else {
			return [array];
		}
	}

	disconnect() {
		return new Promise((resolve, reject) => {
			const promises = this.connectionsId.map(({ connectionId }) => {
				return this.disconnectConnection({ connectionId });
			});
			Promise.all(promises).then((data) => {
				resolve(data);
			}).catch(error => {
				reject(error);
			})
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
			const promises = this.connectionsId.map(({ connectionId }) => {
				return this._sendMessageToOneConnection(connectionId, action, body)
			});
			Promise.all(promises).then((data) => {
				resolve(data);
			}).catch(error => {
				reject(error);
			})
		});
	}

	status() {
		return new Promise((resolve, reject) => {
			const promises = this.connectionsId.map(({ connectionId }) => {
				return this._getOneConnectionStatus(connectionId);
			});
			Promise.all(promises).then((data) => {
				resolve(data);
			}).catch(error => {
				reject(error);
			})
		});
	}
}

module.exports = WebSocket;
