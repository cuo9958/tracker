/**
 * 通知模块,导出通知方法
 */

export default {
    /**
     * 发邮件
     * @param txt txt
     * @param to to
     */
    email(txt: string, to: string) {},
    /**
     * 根据项目设置的钉钉地址发钉钉消息
     * @param txt txt
     * @param projectId 项目id
     */
    dingding(txt: string, projectId: number) {},
};
