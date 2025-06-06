import { createLogger, format, transports } from "winston";

const logger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp(),
		format.prettyPrint() // Enable pretty printing for better readability
	),
	transports: [
		new transports.Console(),
		new transports.File({ filename: "logs/app.log" }),
	],
});

export default logger;
