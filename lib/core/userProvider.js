const Next = require("./next.js");
const Request = require("./request.js");
const Response = require("./response.js");

class UserProvider extends Next {

    constructor() {
        super();
        this._repository = null;
    }

    _loadUser(request, response) {
        if (this._repository) {
            if (request.user.username) {
                this._repository.loadUser(request.user.username).then((user) => {
                    if (user === null) {
                        this.warn('User ' + request.user.username + ' not found');
                        response.forbidden("User not found");
                    } else {
                        Object.assign(request.user, user);
                        this.next(request, response);
                    }
                }, (error) => {
                    this.error('Repository failed to load user ' + request.user.username, error);
                    response.internalServerError("Failed to load user");
                });
            } else {
                this.error('Invalid user object');
                response.internalServerError("Internal server error");
            }
        } else {
            this.error('No repository set in UserProvider');
            response.internalServerError("Bad configuration");
        }
    }

    attachRepository(repository) {
        if (typeof repository !== 'object') {
            throw new Error("First parameter of attachRepository must be an object, " + this.typeOf(repository) + " given");
        }
        if (typeof repository.loadUser !== 'function') {
            throw new Error("First parameter of attachRepository must have a function named loadUser, " + this.typeOf(repository.loadUser) + " given");
        }
        if (repository.loadUser.length !== 1) {
            throw new Error("First parameter of attachRepository must have a function named loadUser witch take 1 parameter, " + repository.loadUser.length + " given");
        }
        this._repository = repository;
        return this;
    }

    handleRequest(request, response) {
        if (request === undefined || request === null || request.constructor !== Request) {
            this.error("First parameter of handleRequest() must be Request object type, " + this.typeOf(request) + " given");
            response.internalServerError("Internal server error");
            return;
        }
        if (response === undefined || response === null || response.constructor !== Response) {
            this.error("Second parameter of handleRequest() must be Response object type, " + this.typeOf(response) + " given");
            response.internalServerError("Internal server error");
            return;
        }
        if (request.user) {
            this._loadUser(request, response);
        } else {
            this.next(request, response);
        }
    }

}

module.exports = UserProvider;