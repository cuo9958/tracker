import Router from "koa-router";
import CrosMiddle from "../middleware/cros";

const router = new Router();

router.all("/", CrosMiddle, function (ctx, next) {
    ctx.body = "不存在的接口";
});

export default router.routes();
