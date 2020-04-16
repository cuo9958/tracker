/**
 * 提供默认处理数据的中间件
 */

/**
 * 提供返回正确数据的方式
 * @param ctx ctx
 */
export function sendSucess(ctx: any) {
    ctx.sendSucess = function (data) {
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
    ctx.sendError = function (msg: string, code = 0) {
        ctx.body = {
            code,
            msg,
        };
    };
}
