class FrontendLogger {
	constructor() {
		this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
		this.currentLevel = "debug";
	}

	setLevel(level) {
		if (this.levels[level] !== undefined) {
			this.currentLevel = level;
		} else {
			console.warn(`Invalid log level: ${level}`);
		}
	}

	shouldLog(level) {
		return this.levels[level] >= this.levels[this.currentLevel];
	}

	debug(...args) {
		if (this.shouldLog("debug")) {
			console.debug(...args);
		}
	}

	info(...args) {
		if (this.shouldLog("info")) {
			console.info(...args);
		}
	}

	warn(...args) {
		if (this.shouldLog("warn")) {
			console.warn(...args);
		}
	}

	error(...args) {
		if (this.shouldLog("error")) {
			console.error(...args);
		}
	}
}

const logger = new FrontendLogger();
export default logger;
