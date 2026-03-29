type LogLevel = "info" | "error" | "warn" | "debug";
type LogContext = Record<string, unknown> | undefined;

class Logger {
  constructor(private readonly service: string) {}

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logObject = {
      timestamp,
      level: level.toUpperCase(),
      service: this.service,
      message,
      ...(context ? { context } : {}),
    };

    if (process.env.NODE_ENV === "production") {
      console.log(JSON.stringify(logObject));
      return;
    }

    const contextStr = context
      ? ` | Context: ${JSON.stringify(context, null, 2)}`
      : "";
    const levelColor =
      level === "error" ? "\x1b[31m" : level === "warn" ? "\x1b[33m" : "\x1b[32m";
    const reset = "\x1b[0m";

    console.log(
      `${timestamp} [${levelColor}${level.toUpperCase()}${reset}] [${this.service}] ${message}${contextStr}`,
    );
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  }

  error(message: string, context?: LogContext) {
    this.log("error", message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  }

  debug(message: string, context?: LogContext) {
    this.log("debug", message, context);
  }
}

export const createLogger = (service: string) => new Logger(service);
