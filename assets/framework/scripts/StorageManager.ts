import { _decorator, sys } from 'cc';
const { ccclass, property } = _decorator;

export class StorageManager {
    private static instance: StorageManager;

    private constructor() { }

    static getInstance(): StorageManager {
        if (!this.instance) {
            this.instance = new StorageManager();
        }
        return this.instance;
    }

    setItem(key: string, value: any) {
        sys.localStorage.setItem(key, JSON.stringify(value));
    }

    getItem<T>(key: string, defaultValue: T = null): T {
        const data = sys.localStorage.getItem(key);
        if (!data) {
            return defaultValue;
        }

        try {
            return JSON.parse(data) as T;
        } catch (e) {
            console.warn(`解析本地存储失败 [${key}]:`, data, e);
            return defaultValue;
        }
    }

    removeItem(key: string) {
        sys.localStorage.removeItem(key);
    }
}

export const StorageMgr = StorageManager.getInstance();
