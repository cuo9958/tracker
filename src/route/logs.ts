import Router from "koa-router";
import { IRouterContext } from "../middleware/resp";
import LogCollectionModel from "../model/LogCollection";
import CROS from "../middleware/cros";

const router = new Router();

//获取日志列表
router.get("/", CROS, async (ctx, next) => {
    console.log("查询");
    const { start = 0 } = ctx.query;

    let list: any[] = [];
    try {
        let obj = {};
        list = await LogCollectionModel.search(start, obj);
    } catch (error) {
        console.log(error);
    }

    ctx.body = {
        data: list,
    };
});
router.get("/clear", CROS, async (ctx, next) => {
    try {
    } catch (error) {
        console.log(error);
    }

    ctx.body = {
        data: "",
    };
});

export default router.routes();
