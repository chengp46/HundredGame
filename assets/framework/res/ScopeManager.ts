import { AutoReleaseScope } from "./AutoReleaseScope";

export class ScopeManager {

    private static scopes = new Map<string, AutoReleaseScope>();

    static create(name: string) {
        let scope = this.scopes.get(name);
        if (!scope) {
            scope = new AutoReleaseScope(name);
            this.scopes.set(name, scope);
        }
        return scope;
    }

    static destroy(name: string) {
        const scope = this.scopes.get(name);
        if (!scope) return;
        scope.destroy();
        this.scopes.delete(name);
    }

    static destroyAll() {
        this.scopes.forEach(s => s.destroy());
        this.scopes.clear();
    }
}