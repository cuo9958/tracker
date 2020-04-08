const Router = require("koa-router");
const CrosMiddle = require("../middleware/cros");

const router = new Router();

router.all("/", CrosMiddle, function (ctx, next) {
    ctx.body = "不存在的接口";
});

exports.routers = router.routes();
