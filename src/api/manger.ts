/**
 * 统计表的管理API
 * 1.增删改查统计列表
 * 2.
 */
import Router from "koa-router";

const router = new Router();

//获取项目列表
router.get("/", function (ctx, next) {
    ctx.body = "测试接口";
    ctx;
});
router.get("/", function (ctx) {});

export default router.routes();
