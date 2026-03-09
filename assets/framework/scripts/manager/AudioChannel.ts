import { AudioSource } from 'cc';

export class AudioChannel {

    private _source: AudioSource;
    private _targetVolume: number = 1;

    constructor(source: AudioSource) {
        this._source = source;
    }

    play(clip: any, loop: boolean = false) {
        this._source.clip = clip;
        this._source.loop = loop;
        this._source.play();
    }

    stop() {
        this._source.stop();
    }

    setVolume(v: number) {
        this._source.volume = v;
    }

    getVolume() {
        return this._source.volume;
    }

    // 平滑过渡
    fadeTo(target: number, duration: number = 0.3) {
        const start = this._source.volume;
        const diff = target - start;
        const startTime = performance.now();
        const update = () => {
            const t = (performance.now() - startTime) / (duration * 1000);
            if (t >= 1) {
                this._source.volume = target;
                return;
            }
            this._source.volume = start + diff * t;
            requestAnimationFrame(update);
        };
        update();
    }
}