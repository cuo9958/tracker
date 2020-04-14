import Router from "koa-router";
import CrosMiddle from "../middleware/cros";

const router = new Router();

/**
 * 接收消息
 */
router.get("/", CrosMiddle, function (ctx, next) {
    ctx.body = "";
});

exports.routers = router.routes();
