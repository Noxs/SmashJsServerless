
class Request {
    constructor() {
        this._method = null;
        this._version = null;
        this._env = null;
        this._url = null; /* ???? */
        this._host = null;
        this._path = null; /* ???? */
        this._headers = null;
        this._body = null;
        this._queryParameters = null; /* TO remove */
        this._parameters = null;
        this._user = null;
    }

}

module.exports = Request;