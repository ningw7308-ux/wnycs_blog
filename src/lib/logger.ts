// ============================================================
// 环境感知日志模块
// - Node.js 运行时：使用 pino 输出到控制台和文件
// - Edge Runtime：使用 console 作为轻量回退，不依赖 Node.js API
// ============================================================

// 检测是否在 Edge Runtime（无顶级 await 可用时的同步检测方式）
const isEdge =
  typeof process === "undefined" ||
  typeof process.cwd !== "function" ||
  typeof globalThis.EdgeRuntime === "string";

// ============================================================
// Edge 回退实现
// ============================================================
function createEdgeLogger() {
  const noop = () => {};
  return {
    info: console.log.bind(console, "[INFO]"),
    warn: console.warn.bind(console, "[WARN]"),
    error: console.error.bind(console, "[ERROR]"),
    debug: console.debug.bind(console, "[DEBUG]"),
    fatal: console.error.bind(console, "[FATAL]"),
    trace: console.trace.bind(console, "[TRACE]"),
    child: () => createEdgeLogger(),
    level: "info",
    silent: noop,
  };
}

// ============================================================
// Node.js 完整实现（延迟加载，仅在 Node 环境执行）
// ============================================================
let _logger: ReturnType<typeof createEdgeLogger> | null = null;

function getLogger() {
  if (_logger) return _logger;

  if (isEdge) {
    _logger = createEdgeLogger();
    return _logger;
  }

  // Node.js 环境：加载 pino
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pino = require("pino");
    const fs = require("fs");
    const path = require("path");

    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    _logger = pino(
      {
        level: "info",
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      pino.multistream([
        {
          stream: pino.transport({
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
              ignore: "pid,hostname",
            },
          }),
        },
        {
          stream: pino.destination({
            dest: path.join(logsDir, "app.log"),
            sync: false,
          }),
        },
      ])
    );
  } catch {
    _logger = createEdgeLogger();
  }

  return _logger;
}

const logger = new Proxy({} as ReturnType<typeof createEdgeLogger>, {
  get(_target, prop) {
    return getLogger()[prop as keyof ReturnType<typeof createEdgeLogger>];
  },
});

export default logger;