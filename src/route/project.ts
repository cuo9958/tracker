import Router from "koa-router";
import { IRouterContext } from "../middleware/resp";

const router = new Router();

//获取项目列表
router.get("/", async (ctx: IRouterContext, next) => {
    const { start = 0 } = ctx.query;

    const list = [];

    const data = {
        rows: list,
        count: 0,
    };
    ctx.Success(data);
});

//根据项目id获取项目信息
router.get("/:id", function (ctx: IRouterContext, next) {
    const id = ctx.params.id;

    const model = {};

    ctx.Success(model);
});

//增加或者修改项目内容
router.post("/:id", function (ctx: IRouterContext, next) {
    const id = ctx.params.id;
    const { title } = ctx.request.body as any;

    const model = {
        title,
    };
    ctx.Success(model);
});

//删除项目
router.del("/:id", function (ctx: IRouterContext, next) {
    ctx.Success();
});

export default router.routes();
