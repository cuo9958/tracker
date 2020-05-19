import Router from "koa-router";
import CROS from "../middleware/cros";
import { initAgent } from "../utils/userAgent";
import LogCollectionModel from "../model/LogCollection";

const router = new Router();

//接受日志
router.post("/", CROS, function (ctx, next) {
    const headers = new Map();
    for (const key in ctx.headers) {
        const head = ctx.headers[key];
        if (head != undefined) {
            headers.set(key, head);
        }
    }
    let ip = headers.get("x-real-ip") || ctx.ip;
    const userAgent: string = headers.get("user-agent");
    const token = headers.get("token") || "";
    const url = headers.get("referer");
    // if (!token) {
    //     console.log("无法根据token拿到项目、账户id");
    // }
    const { title, desc, uid, meta, version } = ctx.request.body as any;

    const createTime = new Date();
    const timeSpan = createTime.getTime();
    let data = "";
    if (meta) {
        data = JSON.stringify(meta);
    }
    if (!/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/.test(ip)) {
        ip = "0.0.0.0";
    }
    const browerData = initAgent(userAgent);

    const obj = {
        title,
        uid,
        desc,
        ip,
        userAgent,
        createTime,
        timeSpan,
        url,
        data,
        version,
        sys: browerData.sys,
        os: browerData.os,
    };
    const platform = headers.get("platform");
    LogCollectionModel.insert(
        {
            title,
            platform: platform,
        },
        {
            desc,
            meta: data,
            ip,
            userAgent,
            url,
            os: browerData.os,
            createTime: Date.now(),
        }
    );
    // ctx.body = obj;
    ctx.body = "ok";
});
//接收警告
//接收错误
//接收信息
//自定义消息

export default router.routes();
