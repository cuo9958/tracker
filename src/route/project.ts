import Router from "koa-router";

const router = new Router();

//获取项目列表
router.get("/", function (ctx, next) {
    const { start = 0 } = ctx.query;

    const list = [];

    const data = {
        rows: list,
        count: 0,
    };
    ctx.body = {
        code: 1,
        data,
    };
});

//根据项目id获取项目信息
router.get("/:id", function (ctx, next) {
    const id = ctx.params.id;

    const model = {};
    ctx.body = {
        code: 1,
        data: model,
    };
});

//增加或者修改项目内容
router.post("/:id", function (ctx, next) {
    const id = ctx.params.id;
    const { title } = ctx.request.body;

    const model = {
        title,
    };
    ctx.body = {
        code: 1,
        data: model,
    };
});

//删除项目
router.del("/:id", function (ctx, next) {
    ctx.body = {
        code: 1,
    };
});
exports.routers = router.routes();
