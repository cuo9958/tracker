/**
 * 将字符串初始化成一个数组
 * @param userAgent 字符串
 */
function getList(userAgent: string) {
    const list1 = userAgent.split(" ");
    let isOpen = false;
    let list: string[] = [];
    list1.forEach((item: string) => {
        if (item.includes("(")) {
            isOpen = true;
            list.push(item.replace("(", ""));
        } else if (item.includes(")")) {
            isOpen = false;
            list[list.length - 1] = (list[list.length - 1] + " " + item).replace(")", "");
        } else if (isOpen) {
            list[list.length - 1] = list[list.length - 1] + " " + item;
        } else {
            list.push(item);
        }
    });
    return list;
}
interface InitBack {
    sys: string;
    os: string;
}
/**
 * 获取系统
 * @param userAgent 字符串
 */
export function initAgent(userAgent: string): InitBack {
    const str = userAgent.toLowerCase();
    const list = getList(str);
    let obj = {
        sys: "",
        os: "",
    };
    if (list.length < 2) return obj;
    obj.sys = list[1];
    obj.os = list[4];

    if (obj.os.includes("chrome")) {
        obj.os = "谷歌浏览器" + obj.os;
    }
    if (str.includes("firefox")) {
        obj.os = "火狐浏览器" + list[list.length - 1];
    }
    if (str.includes("safari")) {
        obj.os = "Safari浏览器" + list[list.length - 1];
    }
    //Opera
    if (str.includes("opera")) {
        obj.os = "Safari浏览器" + list[0];
    }
    //QQBrowser
    if (str.includes("qqbrowser")) {
        obj.os = "QQ浏览器" + list[list.length - 1];
    }
    //Maxthon
    if (str.includes("maxthon")) {
        obj.os = "遨游浏览器" + list[list.length - 2];
    }
    //MetaSr
    if (str.includes("metaSr")) {
        obj.os = "搜狗浏览器" + list[list.length - 2];
    }
    return obj;
}
