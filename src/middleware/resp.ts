/**
 * 提供默认处理数据的中间件
 */
import Koa from "koa";
import { IRouterParamContext } from "koa-router";

export type IRouterContext = Koa.ParameterizedContext &
    IRouterParamContext & {
        Sucess(data?: any): void;
        Error(data: any, code?: number): void;
    };

/**
 * 提供返回正确数据的方式
 * @param ctx ctx
 */
export function sendSucess(ctx: any) {
    ctx.Sucess = function (data = "ok") {
        ctx.body = {
            code: 1,
            data,
        };
    };
}

/**
 * 提供返回默认错误和自定义code的形式
 * @param ctx ctx
 */
export function sendError(ctx) {
    ctx.Error = function (msg: string, code = 0) {
        ctx.body = {
            code,
            msg,
        };
    };
}
