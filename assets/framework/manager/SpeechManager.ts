import { AudioMgr } from "./AudioManager";

class SpeechData {
    text: string;
    endCallback: () => void;
}

export class SpeechManager {

    private static _instance: SpeechManager;
    public static get instance() {
        if (!this._instance) this._instance = new SpeechManager();
        return this._instance;
    }

    private _queue: SpeechData[] = [];
    private _isSpeaking = false;
    private speakId: number = 0;


    speak(text: string, callback:()=>void = null) {
        let spData = new SpeechData();
        spData.text = text;
        spData.endCallback = callback;
        this._queue.push(spData);
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
        const utter = new SpeechSynthesisUtterance(text.text);
        utter.onend = () => {
            this._isSpeaking = false;
            text.endCallback && text.endCallback();
            this.playNext();
        };
        window.speechSynthesis.speak(utter);
    }
}

export const SpeechMgr = SpeechManager.instance;