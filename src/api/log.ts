import Router from "koa-router";
import CROS from "../middleware/cros";
import { initAgent } from "../utils/userAgent";
import LogCollectionModel from "../model/LogCollection";
import BigDataModel from "../model/BigData";

const router = new Router();

//get日志
router.get("/", function (ctx) {
    let ip = ctx.headers["x-real-ip"] || ctx.ip;
    const userAgent: string = ctx.headers["user-agent"] || "";
    const url = ctx.headers.referer;
    // if (!token) {
    //     console.log("无法根据token拿到项目、账户id");
    // }
    const { title, desc, meta, version, platform, clientid, token } = ctx.query;

    let data = "";
    if (meta) {
        data = JSON.stringify(meta);
    }
    if (!/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/.test(ip)) {
        ip = "0.0.0.0";
    }
    const browerData = initAgent(userAgent);

    // LogCollectionModel.insert(
    //     {
    //         title,
    //         platform: platform,
    //         version,
    //         clientid,
    //     },
    //     {
    //         desc,
    //         meta: data,
    //         ip,
    //         userAgent,
    //         url,
    //         os: browerData.os,
    //         createTime: Date.now(),
    //     }
    // );
    BigDataModel.insert({
        title,
        platform,
        version,
        clientid,
        desc,
        meta: data,
        ip,
        userAgent,
        url,
    });
    // ctx.body = obj;
    ctx.body = "ok";
});

//接受日志
router.post("/", CROS, function (ctx, next) {
    let ip = ctx.headers["x-real-ip"] || ctx.ip;
    const userAgent: string = ctx.headers["user-agent"] || "";
    const url = ctx.headers["referer"] || "";

    const { title, desc, meta, version, token, platform, clientid } = ctx.request.body as any;
    // if (!token) {
    //     console.log("无法根据token拿到项目、账户id");
    // }

    let data = "";
    if (meta) {
        data = JSON.stringify(meta);
    }
    if (!/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/.test(ip)) {
        ip = "0.0.0.0";
    }
    const browerData = initAgent(userAgent);

    // LogCollectionModel.insert(
    //     {
    //         title,
    //         platform: platform,
    //         version,
    //         clientid,
    //     },
    //     {
    //         desc,
    //         meta: data,
    //         ip,
    //         userAgent,
    //         url,
    //         os: browerData.os,
    //         createTime: Date.now(),
    //     }
    // );
    BigDataModel.insert({
        title,
        platform,
        version,
        clientid,
        desc,
        meta: data,
        ip,
        userAgent,
        url,
    });
    // ctx.body = obj;
    ctx.body = "ok";
});

//测试
router.get("/test", CROS, function (ctx) {
    ctx.body = "ok";
});
//接收警告
//接收错误
//接收信息
//自定义消息

export default router.routes();
