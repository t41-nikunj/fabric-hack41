/**
 * Logger utility for frontend application
 * Provides structured logging with levels and module context
 */

const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const currentLevel = import.meta.env.VITE_LOG_LEVEL || 'info';

function formatLog(level, module, message, data) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `${timestamp} | ${level.toUpperCase().padEnd(5)} | ${module} | ${message}${dataStr}`;
}

function shouldLog(level) {
    return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

export function createLogger(module) {
    const log = (level, message, data) => {
        if (!shouldLog(level)) return;

        const formatted = formatLog(level, module, message, data);

        switch (level) {
            case 'error':
                console.error(formatted);
                break;
            case 'warn':
                console.warn(formatted);
                break;
            default:
                console.log(formatted);
        }
    };

    return {
        debug: (msg, data) => log('debug', msg, data),
        info: (msg, data) => log('info', msg, data),
        warn: (msg, data) => log('warn', msg, data),
        error: (msg, data) => log('error', msg, data),
    };
}

// Default logger for general use
export const logger = createLogger('App');
