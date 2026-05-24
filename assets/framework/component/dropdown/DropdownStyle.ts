import { Color } from 'cc';

export class DropdownStyle {

    /** Item高度 */
    public itemHeight = 60;

    /** 最大显示数量 */
    public maxVisibleCount = 6;

    /** 展开动画时间 */
    public animTime = 0.15;

    /** 普通颜色 */
    public normalColor = new Color(
        255,
        255,
        255
    );

    /** 选中颜色 */
    public selectedColor = new Color(
        255,
        220,
        0
    );
}