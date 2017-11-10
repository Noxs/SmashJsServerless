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
            this.error('Repository has not been set in UserProvider');
            response.internalServerError("Bad configuration");
        }
    }

    attachRepository(repository) {
        if (typeof repository !== 'object') {
            throw new Error("First parameter of attachRepository must be an object, " + typeof repository + " given");
        }
        if (typeof repository.loadUser !== 'function') {
            throw new Error("First parameter of attachRepository must have a function named loadUser, " + typeof repository.loadUser + " given");
        }
        if (repository.loadUser.length !== 1) {
            throw new Error("First parameter of attachRepository must have a function named loadUser witch take 1 parameter, " + repository.loadUser.length + " given");
        }
        this._repository = repository;
        return this;
    }

    handleRequest(request, response) {
        if (!request || request.constructor !== Request) {
            throw new Error("First parameter of handleRequest() must be Request object type, " + typeof request + (request ? " " + request.constructor : "") + " given");
        }
        if (!response || response.constructor !== Response) {
            throw new Error("Second parameter of handleRequest() must be Response object type, " + typeof response + (response ? " " + response.constructor : "") + " given");
        }
        if (request.user) {
            this._loadUser(request, response);
        } else {
            this.next(request, response);
        }
    }

}

module.exports = UserProvider;