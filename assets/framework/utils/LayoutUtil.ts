import { Node, Widget } from "cc";

export class LayoutUtil {
    static AlignVerticalHorizontalFull(node: Node) {
        let widget = node.addComponent(Widget);
        widget.isAlignLeft = true;
        widget.left = 0;
        widget.isAlignRight = true;
        widget.right = 0;
        widget.isAlignTop = true;
        widget.top = 0;
        widget.isAlignBottom = true;
        widget.bottom = 0;
        widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
    }
}