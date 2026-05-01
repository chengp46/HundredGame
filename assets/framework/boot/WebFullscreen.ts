// 隐藏地址栏 + 获取真实高度
export class WebFullscreen {

    static init() {

        const fixHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        fixHeight();

        window.addEventListener('resize', fixHeight);
        window.addEventListener('orientationchange', fixHeight);
    }
}