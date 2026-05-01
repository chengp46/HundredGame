import { sys, view } from 'cc';

export class SafeAreaManager {

    static apply() {

        if (!sys.isBrowser) return;

        let elementStyle = getComputedStyle(document.documentElement);
        const safeTop = parseFloat(elementStyle.getPropertyValue('env(safe-area-inset-top)')) || 0;
        const safeBottom = parseFloat(elementStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0;

        console.log("SafeArea:", safeTop, safeBottom);
    }
}