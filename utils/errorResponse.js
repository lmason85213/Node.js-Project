class ErrorResponse extends Error {
    constructor(message, statusCode){
        super(message);
        this.stautsCode = statusCode;
    }
}

module.exports = ErrorResponse;