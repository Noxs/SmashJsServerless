class SmashError {
    constructor(options = {}) {
        const { code, message, internalMessage, externalMessage, reason, details } = options;
        this.code = code;
        this.internalMessage = internalMessage || message;
        this.externalMessage = externalMessage || message;
        this.reason = reason || message;
        this.details = details;
    }
}
