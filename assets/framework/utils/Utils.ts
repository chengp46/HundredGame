export class Utils {

    // 延迟sec秒执行
    static sleep(sec: number) {
        return new Promise<void>(resolve => {
            setTimeout(resolve, sec * 1000);
        });
    }


}