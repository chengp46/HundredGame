/**
 * 解决resize 抖动iOS 多次触发 首帧闪
 */
export class WebResizeGuard {

    private static timer: any;
    private static lastW = 0;
    private static lastH = 0;

    static watch(callback: () => void) {

        const check = () => {
            const w = window.visualViewport?.width || window.innerWidth;
            const h = window.visualViewport?.height || window.innerHeight;

            // 忽略微小变化
            if (Math.abs(w - this.lastW) < 2 && Math.abs(h - this.lastH) < 2) {
                callback();
                return;
            }

            this.lastW = w;
            this.lastH = h;

            this.timer = setTimeout(check, 60);
        };

        clearTimeout(this.timer);
        this.timer = setTimeout(check, 60);
    }
}