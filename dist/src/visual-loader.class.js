"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualLoader = void 0;
const ansi_colors_1 = require("ansi-colors");
const cli_progress_1 = require("cli-progress");
class VisualLoader {
    constructor(name) {
        this.chunkBar = new cli_progress_1.SingleBar({
            format: `${name} |${(0, ansi_colors_1.cyan)('{bar}')}| {percentage}% || {value}/{total} Chunks || ETA: {eta_formatted} || Duration: {duration_formatted}`,
            clearOnComplete: false,
            hideCursor: true,
        }, cli_progress_1.Presets.shades_grey);
    }
    stop() {
        this.chunkBar.stop();
    }
    initChunksBar(chunksNumber) {
        this.chunkBar.start(chunksNumber, 0);
    }
    incrementChunks() {
        this.chunkBar.increment();
    }
}
exports.VisualLoader = VisualLoader;
//# sourceMappingURL=visual-loader.class.js.map