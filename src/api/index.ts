import Router from "koa-router";
import CrosMiddle from "../middleware/cros";

const router = new Router();

router.all("/", CrosMiddle, function (ctx, next) {
    ctx.body = "测试接口";
});

export default router.routes();
