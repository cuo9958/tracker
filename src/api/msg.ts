import Router from "koa-router";
import CrosMiddle from "../middleware/cros";

const router = new Router();

/**
 * 接收消息
 */
router.get("/", CrosMiddle, function (ctx, next) {
    //1.校验事件id是否合规
    //2.查询设备信息
    //3.事件数据组合
    //4.存入数据
    ctx.body = "";
});
/**
 * 接受设备信息
 */
router.get("/device", CrosMiddle, function (ctx, next) {
    //1.拿到设备关键id
    //2.校验设备id是否合规
    //3.将设备信息存入缓存和数据库

    ctx.body = "";
});
export default router.routes();
