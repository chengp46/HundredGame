import { AudioMgr } from "./AudioManager";

export class SpeechManager {

    private static _instance: SpeechManager;
    public static get instance() {
        if (!this._instance) this._instance = new SpeechManager();
        return this._instance;
    }

    private _queue: string[] = [];
    private _isSpeaking = false;

    speak(text: string) {
        this._queue.push(text);
        this.playNext();
    }

    private playNext() {
        if (this._isSpeaking) return;
        if (this._queue.length === 0) {
            AudioMgr.recoverBGM();
            return;
        }
        const text = this._queue.shift();
        this._isSpeaking = true;
        AudioMgr.duckBGM();
        const utter = new SpeechSynthesisUtterance(text);
        utter.onend = () => {
            this._isSpeaking = false;
            this.playNext();
        };

        window.speechSynthesis.speak(utter);
    }
}

export const SpeechMgr = SpeechManager.instance;