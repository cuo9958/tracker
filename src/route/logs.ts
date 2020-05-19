import Router from "koa-router";
import LogCollectionModel from "../model/LogCollection";

const router = new Router();

//获取日志列表
router.get("/", async (ctx, next) => {
    const { start = 0, title, platform, clientid, version } = ctx.query;
    let list: any[] = [];
    try {
        let obj = {
            title,
            platform,
            clientid,
            version,
        };
        list = await LogCollectionModel.search(start, obj);
        ctx.body = {
            code: 1,
            data: list,
        };
    } catch (error) {
        console.log(error);
        ctx.body = {
            code: 0,
            msg: error.message,
        };
    }
});
//清空数据库
router.get("/clear", async (ctx, next) => {
    try {
    } catch (error) {
        console.log(error);
    }

    ctx.body = {
        data: "",
    };
});

export default router.routes();
