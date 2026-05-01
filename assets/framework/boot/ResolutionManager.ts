import { _decorator, view, Node, screen, ResolutionPolicy, Size, size } from 'cc';
import { DeviceUtil } from '../utils/DeviceUtil';
const { ccclass } = _decorator;

@ccclass('ResolutionManager')
export class ResolutionManager {

    /** UI设计尺寸（仅用于比例） */
    readonly DESIGN_WIDTH = 720;
    readonly DESIGN_HEIGHT = 1280;

    private static _instance: ResolutionManager;
    public static get instance() {
        if (!this._instance) {
            this._instance = new ResolutionManager();
        }
        return this._instance;
    }

    init() {
        this.update();
        window.addEventListener('resize', this.update.bind(this));
        window.addEventListener('orientationchange', this.update.bind(this));
        window.visualViewport?.addEventListener('resize', this.update.bind(this));
    }


    /** 永远无黑边适配 */
    update() {
        // ===== 真实浏览器尺寸 =====
        const width = window.visualViewport?.width || window.innerWidth;
        const height = window.visualViewport?.height || window.innerHeight;
        view.setFrameSize(width, height);
    }
}