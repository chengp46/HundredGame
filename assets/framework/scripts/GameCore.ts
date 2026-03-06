import { LanguageMgr, LanguageType } from "./LanguageManager";
import { SceneMgr, UIDialog, UIView } from "./SceneManager";
import { ArrayUtil } from "./utils/ArrayUtil";
import { DeviceUtil } from "./utils/DeviceUtil";
import { ImageUtil } from "./utils/ImageUtil";
import { LayerUtil } from "./utils/LayerUtil";
import { MathUtil } from "./utils/MathUtil";
import { ObjectUtil } from "./utils/ObjectUtil";
import { PlatformUtil } from "./utils/PlatformUtil";
import { StringUtil } from "./utils/StringUtil";
import { Timer } from "./utils/TimeUtils";
import { GlobalData } from "./GlobalData";
import { AudioMgr } from "./AudioManager";
import { ConfigMgr } from "./ConfigManager";
import { MessageMgr } from "./MessageManager";
import { StorageMgr } from "./StorageManager";
import HttpRequest, { HttpResponse } from "./HttpRequest";
import LogManager from "./LogManager";
import { ResLoader } from "./ResLoader";
import { DialogResource } from "./Decorators";
import { WsClient, WsSocket } from "./WsClient";
import { LayoutUtil } from "./utils/LayoutUtil";

export class GameCore {
    audio = AudioMgr;
    language = LanguageMgr;
    scene = SceneMgr;
    config = ConfigMgr;
    message = MessageMgr;
    storage = StorageMgr;
    wssock = WsSocket;
    data = GlobalData.instance;
    languageType = LanguageType;
    UIView = UIView;
    UIDialog = UIDialog;
    httpReq = HttpRequest;
    log = LogManager;
    loader = ResLoader;
    arrayUtil = ArrayUtil;
    deviceUtil = DeviceUtil;
    imageUtil = ImageUtil;
    layerUtil = LayerUtil;
    mathUtil = MathUtil;
    objectUtil = ObjectUtil;
    platformUtil = PlatformUtil;
    stringUtil = StringUtil;
    layout = LayoutUtil;
    timer = Timer;  
}

export const DlgResource = DialogResource;
export type HResponse = HttpResponse;

const core = new GameCore();
(window as any).core = core; // 避免 declare global 的额外声明
export default core;