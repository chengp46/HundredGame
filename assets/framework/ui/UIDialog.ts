import { UIView } from "./UIView";

export class UIDialog extends UIView {

    private resolve?: (v: any) => void;
    private closed = false;

    _bind(r: (v: any) => void) {
        this.resolve = r;
    }

    close(result?: any) {
        if (this.closed) return;
        this.closed = true;
        this.resolve?.(result);
        this.resolve = undefined;
        this.node.destroy();
    }

    protected onDestroy() {
        super.onDestroy();
        if (!this.closed)
            this.resolve?.(null);
    }
}