import {cyan} from 'ansi-colors';
import {
	Presets,
	SingleBar,
} from 'cli-progress';

export class VisualLoader {
	private chunkBar: SingleBar;

	constructor(
		name: string,
	) {
		this.chunkBar = new SingleBar({
			format: `${name} |${
				cyan('{bar}')
			}| {percentage}% || {value}/{total} Chunks || ETA: {eta_formatted} || Duration: {duration_formatted}`,
			clearOnComplete: false,
			hideCursor: true,
		}, Presets.shades_grey);
	}

	public stop(): void {
		this.chunkBar.stop();
	}

	public initChunksBar(chunksNumber: number): void {
		this.chunkBar.start(chunksNumber, 0);
	}

	public incrementChunks(): void {
		this.chunkBar.increment();
	}
}
