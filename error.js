const LEVELS = [
    "DEBUG",
    "INFO",
    "WARN",
    "ERROR",
    "CRITICAL",
]

class NASError extends Error {
    constructor(message, level = 1) {
        super(message);
        this.level = level;
        this.levelText = LEVELS[level];
    }
}

NASError.prototype.name = NASError.name;

export { NASError };
