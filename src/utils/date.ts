export function DateFormart(time: Date, formart = "yyyy-MM-dd hh:mm:ss") {
    formart = formart.replace("yyyy", time.getFullYear() + "");
    formart = formart.replace("MM", (time.getMonth() + 1 + "").padStart(2, "0"));
    formart = formart.replace("dd", (time.getDate() + "").padStart(2, "0"));
    formart = formart.replace("hh", (time.getHours() + "").padStart(2, "0"));
    formart = formart.replace("mm", (time.getMinutes() + "").padStart(2, "0"));
    formart = formart.replace("ss", (time.getSeconds() + "").padStart(2, "0"));
    return formart;
}
