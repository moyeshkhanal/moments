// Import Pino
import pino, { Logger } from 'pino';

// Set production environment check
const isProduction = process.env.NODE_ENV === 'production';

// Configure Pino logger
const logger: Logger = pino({
  level: isProduction ? 'info' : 'debug',  // Use 'info' for production, 'debug' otherwise
  transport: !isProduction
    ? { target: 'pino-pretty', options: { colorize: true } } // Pretty print only in development
    : undefined, // No transport in production for raw JSON output
  base: undefined, // Remove default Pino properties
  formatters: {
    level: (label) => ({ level: label }), // Customize level key to output 'level' consistently
  },
});

export default logger;
