const Next = require("./next.js");
const Request = require("./request.js");
const Response = require("./response.js");

class UserProvider extends Next {

    constructor() {
        super();
        this._repository = null;
    }

    _getUser(request, response) {
        if (this._repository) {
            if (request.user.username) {
                this._repository.getUser(request.user.username).then((user) => {
                    if (user === null) {
                        this.warn('User ' + request.user.username + ' not found');
                        response.forbidden();
                    } else {
                        Object.assign(request.user, user);
                        this.next(request, response);
                    }
                }, (error) => {
                    this.error('Repository failed to load user ' + request.user.username, error);
                    response.internalServerError("Internal server error");
                });
            } else {
                this.error('Invalid user object');
                response.internalServerError("Internal server error");
            }
        } else {
            this.error('No repository set in UserProvider');
            response.internalServerError("Internal server error");
        }
    }

    attachRepository(repository) {
        if (typeof repository !== 'object') {
            throw new Error("First parameter of attachRepository must be an object, " + this.typeOf(repository));
        }
        if (typeof repository.getUser !== 'function') {
            throw new Error("First parameter of attachRepository must have a function named getUser, " + this.typeOf(repository.getUser));
        }
        if (repository.getUser.length !== 1) {
            throw new Error("First parameter of attachRepository must have a function named getUser witch take 1 parameter, " + repository.getUser.length + " given");
        }
        this._repository = repository;
        return this;
    }

    handleRequest(request, response) {
        if (request === undefined || request === null || request.constructor !== Request) {
            this.error("First parameter of handleRequest() must be Request object type, " + this.typeOf(request));
            response.internalServerError("Internal server error");
            return;
        }
        if (response === undefined || response === null || response.constructor !== Response) {
            this.error("Second parameter of handleRequest() must be Response object type, " + this.typeOf(response));
            response.internalServerError("Internal server error");
            return;
        }
        if (request.user) {
            this._getUser(request, response);
        } else {
            this.next(request, response);
        }
    }

}

module.exports = UserProvider;