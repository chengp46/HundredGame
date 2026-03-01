import { sys, log, warn, error } from 'cc';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
    debug?: boolean;   // 是否开启调试
    level?: LogLevel;  // 最低日志级别
}

export default class LogManager {
    private static debugMode = true;
    private static level: LogLevel = 'debug';

    /** 初始化配置 */
    static init(options: LoggerOptions = {}) {
        this.debugMode = options.debug ?? true;
        if (options.level) this.level = options.level;
    }

    /** 判断是否需要输出该日志级别 */
    private static shouldLog(level: LogLevel): boolean {
        const order: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        return order.indexOf(level) >= order.indexOf(this.level);
    }

    /** 解析调用堆栈（Web 平台） */
    private static parseStack(): string {
        const err = new Error();
        const stackLines = err.stack?.split('\n') || [];

        // 找到第一个不包含 LogManager 的调用
        const line = stackLines.find(l =>
            !/LogManager/.test(l) &&
            !/console/.test(l) &&
            !/cc\./.test(l)
        );
        if (!line) return '';

        // 浏览器环境常见匹配
        const match = line.match(/(http.*):(\d+):(\d+)/);
        if (match) {
            const [, filePath, lineNum, colNum] = match;
            const fileName = filePath.split(/[\\/]/).pop();
            return `${fileName}:${lineNum}:${colNum}`;
        }
        return '';
    }

    /** 格式化日志 */
    private static format(level: LogLevel, args: unknown[]): unknown[] {
        const caller = (sys.isBrowser) ? this.parseStack() : '';
        const prefix = `${level.toUpperCase()}${caller ? ` [${caller}]` : ''}`;

        if (sys.isBrowser) {
            // 浏览器彩色日志
            const colorMap: Record<LogLevel, string> = {
                debug: 'color: #999',
                info: 'color: #00bfff',
                warn: 'color: #ffa500',
                error: 'color: #ff4d4f',
            };
            return [`%c${prefix}`, colorMap[level], ...args];
        } else {
            // 原生：退化为普通字符串
            return [`${prefix}`, ...args];
        }
    }

    /** 通用输出 */
    private static output(level: LogLevel, ...args: unknown[]) {
        if (!this.debugMode || !this.shouldLog(level)) return;

        if (sys.isBrowser) {
            switch (level) {
                case 'debug': console.debug(...this.format(level, args)); break;
                case 'info':  console.log(...this.format(level, args)); break;
                case 'warn':  console.warn(...this.format(level, args)); break;
                case 'error': console.error(...this.format(level, args)); break;
            }
        } else {
            // 原生：走 cc.log 系统，保证日志能在 Xcode/Android Studio 控制台看到
            switch (level) {
                case 'debug': log(...this.format(level, args)); break;
                case 'info':  log(...this.format(level, args)); break;
                case 'warn':  warn(...this.format(level, args)); break;
                case 'error': error(...this.format(level, args)); break;
            }
        }
    }

    static debug(...args: unknown[]) { this.output('debug', ...args); }
    static info(...args: unknown[])  { this.output('info', ...args); }
    static warn(...args: unknown[])  { this.output('warn', ...args); }
    static error(...args: unknown[]) { this.output('error', ...args); }
}
