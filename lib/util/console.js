
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
}

module.exports = Console;