import { LanguageMgr, LanguageType } from "./manager/LanguageManager";
import { SceneMgr, UIDialog, UIView } from "./manager/SceneManager";
import { ArrayUtil } from "./utils/ArrayUtil";
import { DeviceUtil } from "./utils/DeviceUtil";
import { ImageUtil } from "./utils/ImageUtil";
import { LayerUtil } from "./utils/LayerUtil";
import { MathUtil } from "./utils/MathUtil";
import { ObjectUtil } from "./utils/ObjectUtil";
import { PlatformUtil } from "./utils/PlatformUtil";
import { StringUtil } from "./utils/StringUtil";
import { Timer } from "./utils/TimeUtils";
import { GlobalData } from "./manager/GlobalData";
import { AudioMgr } from "./manager/AudioManager";
import { ConfigMgr } from "./manager/ConfigManager";
import { MessageMgr } from "./manager/MessageManager";
import { StorageMgr } from "./manager/StorageManager";
import HttpRequest, { HttpResponse } from "./manager/HttpRequest";
import LogManager from "./manager/LogManager";
import { ResLoader } from "./manager/ResLoader";
import { DialogResource } from "./manager/Decorators";
import { WsClient, WsSocket } from "./manager/WsClient";
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