import math
import re


digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
units = [
    "",
    "十",
    "百",
    "千",
    "萬",
    "十",
    "百",
    "千",
    "億",
    "十",
    "百",
    "千",
    "兆",
    "十",
    "百",
    "千",
    "京",
    "十",
    "百",
    "千",
    "垓",
]
minus = "負"

smallUnit = units[1] + units[2] + units[3]
bigUnit = units[4] + units[8] + units[12] + units[18] + units[20]
zero = digits[0]


def int_to_chinese(num):
    str = ""
    n = math.floor(abs(num))
    if n < 1:
        return (num < 0 and minus or "") + zero
    uc = units.copy()
    while n > 0:
        d = n % 10  # 数字
        u = uc.pop(0)  # 单位
        str = digits[d] + u + str
        n = math.floor(n / 10)

    print(str)
    str = re.sub("(" + zero + ")[" + smallUnit + "]", r"\1", str) # 零千 -> 零
    print(str)
    str = re.sub(
        "([" + bigUnit + "])[^" + smallUnit + "]+([" + bigUnit + "])", r"\1" + zero, str
    )
    print(str)
    str = re.sub(
        "([" + smallUnit + "])" + zero + "+([" + bigUnit + "])", r"\1\2" + zero, str
    )
    print(str)
    str = re.sub("(" + zero + ")+", r"\1", str)
    print(str)
    str = re.sub(zero + "+$", "", str)
    print(str)
    str = re.sub("^" + digits[1] + units[1], units[1], str)
    print(str)
    return (num < 0 and minus or "") + str
