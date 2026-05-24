import { Component } from "cc";

export class Utils {

    // 延迟sec秒执行
    static delay(comp: Component, sec: number) {
        return new Promise<void>(resolve => {
            comp.scheduleOnce(resolve, sec);
        });
    }


}