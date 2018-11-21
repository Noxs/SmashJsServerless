const smash = require("../../../../smash.js");
const Next = require("./next.js");
const Request = require("./request.js");
const Response = require("./response.js");
const path = require("path");
const USER_PROVIDER_REPOSITORY_FILE = "apiGatewayProxy.user_provider.repository.file";
const USER_PROVIDER_REPOSITORY_DATABASE = "apiGatewayProxy.user_provider.repository.database";
const USER_PROVIDER_REPOSITORY_METHOD = "apiGatewayProxy.user_provider.repository.method";
const USER_PROVIDER_REPOSITORY_ARGUMENTS = "apiGatewayProxy.user_provider.repository.arguments";

class UserProvider extends Next {

    constructor() {
        super();
        this._repository = null;
        this._hasUserProvider = false;
        this._loadConfig();
        this._registerUserRepository();
    }

    _registerUserRepository() {
        if (smash.config.get(USER_PROVIDER_REPOSITORY_FILE)) {
            const file = smash.config.get(USER_PROVIDER_REPOSITORY_FILE);
            const filePath = path.resolve(path.join(process.cwd(), file));
            try {
                this.attachRepository(require(filePath));
            } catch (error) {
                this.error("Failed to load user repository from file: " + file + " / " + filePath + " to user provider", error);
                throw new Error("Failed to load user repository from file: " + file + " / " + filePath + " to user provider");
            }
            this._hasUserProvider = true;
        } else if (smash.config.get(USER_PROVIDER_REPOSITORY_DATABASE)) {
            const database = smash.config.get(USER_PROVIDER_REPOSITORY_DATABASE);
            try {
                this.attachRepository(smash.database(database));
            } catch (error) {
                this.error("Failed to load user repository from database: " + database + " to user provider", error);
                throw new Error("Failed to load user repository from database: " + database + " to user provider");
            }
            this._hasUserProvider = true;
        } else {
            this.info("No repository configured, user provider is disable");
        }
        return this;
    }

    attachRepository(module) {
        let instance = module;
        try {
            if (module.constructor === undefined && typeof module === 'function') {
                instance = new module();
            }
            this._attachRepository(instance);
        } catch (error) {
            this.error("Failed to attach user repository: " + this.typeOf(instance), error);
            throw new Error("Failed to attach user repository: " + this.typeOf(instance));
        }
        return this;
    }

    _loadConfig() {
        this._method = smash.config.get(USER_PROVIDER_REPOSITORY_METHOD);
        this._arguments = smash.config.get(USER_PROVIDER_REPOSITORY_ARGUMENTS);
    }

    _hasValidUserObject(user) {
        for (let i = 0, length = this._arguments.length; i < length; i++) {
            let founded = false;
            for (let key in user) {
                if (key === this._arguments[i]) {
                    founded = true;
                }
            }
            if (founded === false) {
                return false;
            }
        }
        return true;
    }

    _getArguments(user) {
        const args = [];
        for (let i = 0, length = this._arguments.length; i < length; i++) {
            args.push(user[this._arguments[i]]);
        }
        return args;
    }

    _getUser(request, response) {
        if (this._repository && this.hasUserProvider() === true) {
            try {
                this._repository[this._method].apply(this._repository, this._getArguments(request.user)).then((user) => {
                    if (user === null) {
                        this.warn('User ' + this._getArguments(request.user).join(" ") + ' not found');
                        response.forbidden();
                    } else {
                        Object.assign(request.user, user);
                        this.next(request, response);
                    }
                }, (error) => {
                    this.error('Repository failed to load user ' + this._getArguments(request.user).join(" "), error);
                    response.internalServerError("Internal server error");
                });
            } catch (error) {
                this.error('Failed to call repository', error);
                response.internalServerError("Internal server error");
            }
        } else {
            this.error('No repository set in UserProvider');
            response.internalServerError("Internal server error");
        }
    }

    _attachRepository(repository) {
        if (typeof repository !== 'object') {
            throw new Error("First parameter of _attachRepository must be an object, " + this.typeOf(repository));
        }
        if (typeof repository[this._method] !== 'function') {
            throw new Error("Missing function " + this._method + " " + this.typeOf(repository[this._method]) + " in repository");
        }
        if (repository[this._method].length !== this._arguments.length) {
            throw new Error("Repository method called " + this._method + " must take " + this._arguments.length + " arguments, " + repository[this._method].length + " given");
        }
        this._repository = repository;
        return this;
    }

    hasUserProvider() {
        return this._hasUserProvider;
    }

    handleRequest(request, response) {
        if (request === undefined || request === null || request.constructor !== Request) {
            this.error("First parameter of handleRequest() must be Request object type, " + this.typeOf(request));
            return response.internalServerError("Internal server error");
        }
        if (response === undefined || response === null || response.constructor !== Response) {
            this.error("Second parameter of handleRequest() must be Response object type, " + this.typeOf(response));
            return response.internalServerError("Internal server error");
        }
        if (this._hasValidUserObject(request.user) === true) {
            this._getUser(request, response);
        } else {
            this.next(request, response);
        }
    }

}

module.exports = UserProvider;