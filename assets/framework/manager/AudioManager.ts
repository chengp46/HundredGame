import { Node, AudioSource, AudioClip } from 'cc';
import { AudioChannel } from './AudioChannel';
import { ResLoader } from './ResLoader';

export enum AudioChannelType {
    BGM = 1,
    SFX = 2,
    SPEECH = 3
}

export enum AudioPriority {
    LOW = 1,
    NORMAL = 2,
    HIGH = 3
}

export interface ILocalizedAudio {
    key?: string;
    path?: string;
    name?: string;
    bLanguage?: number;
    bSex?: number;
    bundle?: string;
}

export class AudioManager {

    private static _instance: AudioManager;
    public static get instance() {
        if (!this._instance) this._instance = new AudioManager();
        return this._instance;
    }

    private _bgm: AudioChannel;
    private _sfx: AudioChannel;
    private _speech: AudioChannel;
    private _root: Node;
    private mapSourceList = new Map<string, ILocalizedAudio>();

    private _bgmDefaultVolume = 1;
    private _duckVolume = 0.3;

    // 音效开始回调函数
    private startFunc: () => void = null;
    // 音效结束回调函数
    private endFunc: () => void = null;

    // 初始化（在主场景挂载一个 AudioRoot 节点）
    public init(root: Node) {
        this._root = root;
        const bgmSource = root.addComponent(AudioSource);
        const sfxSource = root.addComponent(AudioSource);
        const speechSource = root.addComponent(AudioSource);

        this._bgm = new AudioChannel(bgmSource);
        this._sfx = new AudioChannel(sfxSource);
        this._speech = new AudioChannel(speechSource);

        root.on(AudioSource.EventType.STARTED, this.onAudioStarted, this);
        root.on(AudioSource.EventType.ENDED, this.onAudioEnded, this);
    }

    release(): void {
        this._root.off(AudioSource.EventType.STARTED, this.onAudioStarted, this);
        this._root.off(AudioSource.EventType.ENDED, this.onAudioEnded, this);
    }

    loadConfig(filePath: string, bundle: string) {

    }

    onAudioStarted() {
        this.startFunc && this.startFunc();
    }

    onAudioEnded() {
        this.endFunc && this.endFunc();
    }

    findAudioClip(key: string, callback: (clip: AudioClip) => void) {
        let source = this.mapSourceList.get(key);
        if (source) {
            let call = async () => {
                let audio = await ResLoader.load(source.path, AudioClip, source.bundle);
                callback(audio);
            };
            call();
        } else {
            callback(null);
        }
    }


    // ======================
    // BGM
    // ======================
    playBGM(key: string) {
        this.findAudioClip(key, (clip: AudioClip) => {
            if (clip) {
                this._bgm.play(clip, true);
            }
        });
    }

    stopBGM() {
        this._bgm.stop();
    }

    // 设置背景音乐音量 音量 (0 ~ 1)
    set BGMVolume(volume: number) {
        this._bgmDefaultVolume = volume;
        this._bgm.setVolume(volume);
    }

    get BGMVolume() {
        return this._bgm.getVolume();
    }

    duckBGM() {
        this._bgm.fadeTo(this._duckVolume, 0.3);
    }

    recoverBGM() {
        this._bgm.fadeTo(this._bgmDefaultVolume, 0.3);
    }

    // ======================
    // SFX
    // ======================

    /**
     * 设置音效音量
     * @param volume 音量 (0 ~ 1)
     */
    set EffectVolume(volume: number) {
        if (this._sfx) {
            this._sfx.setVolume(volume);
        }
    }

    get EffectVolume() {
        return this._sfx && this._sfx.getVolume();
    }

    playSFX(key: string, startCall: () => void = null, endCall: () => void = null) {
        this.startFunc = startCall;
        this.endFunc = endCall;
        this.findAudioClip(key, (clip: AudioClip) => {
            if (clip) {
                this._sfx.play(clip, false);
            }
        });
    }

    // ======================
    // Speech
    // ======================

    playSpeechClip(key: string) {
        this.duckBGM();
        this.findAudioClip(key, (clip: AudioClip) => {
            this._speech.play(clip, false);
            setTimeout(() => {
                this.recoverBGM();
            }, clip.getDuration() * 1000);
        });
    }
}

export const AudioMgr = AudioManager.instance;