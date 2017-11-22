
class Console {
    constructor() {
        Object.assign(this, console);
    }

    typeOf(variable) {
        let string = typeof variable;
        if (variable && variable.constructor) {
            string += " " + variable.constructor.name;
        }
        return string;
    }

    buildError(message, code) {
        const error = new Error(message);
        if (code) {
            error.statusCode = code;
        }
        return error;
    }
}

module.exports = Console;