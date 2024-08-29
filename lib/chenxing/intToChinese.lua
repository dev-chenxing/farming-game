---@type string[]
local digits = {
    "零", "一", "二", "三", "四", "五", "六", "七", "八", "九"
}
---@type string[]
local units = {
    "", "十", "百", "千", "萬", "十", "百", "千", "億", "十", "百",
    "千", "兆", "十", "百", "千", "京", "十", "百", "千", "垓"
}
local minus = "負"

local smallUnit = units[1] .. units[2] .. units[3];
local bigUnit = units[4] .. units[8] .. units[12] .. units[16] .. units[20];
local zero = digits[0];

return function(num)
    local str = ""
    local n = math.floor(math.abs(num))
    if (n < 1) then return (num < 0 and minus or "") .. digits[0] end
    local uc = table.copy(units);
    while (n > 0) do
        local d = n % 10; -- 数字
        local u = uc.shift(); -- 单位
        str = digits[d] + u + str;
        n = math.floor(n / 10);
    end
    str = str:gsub("(" .. zero .. ")[" .. smallUnit .. "]", "$1"):gsub("([" ..
                                                                           bigUnit ..
                                                                           "])[^" ..
                                                                           smallUnit ..
                                                                           "]+([" ..
                                                                           bigUnit ..
                                                                           "])",
                                                                       "$1" ..
                                                                           zero)
              :gsub("([" .. smallUnit .. "])" .. zero .. "+([" .. bigUnit ..
                        "])", "$1$2" .. zero)
              :gsub("(" .. digits[0] .. ")+", "$1"):gsub(zero .. "+$", "")
    str = str:gsub("^" .. digits[1] .. units[1], units[1])
    return (num < 0 and minus or "") .. str;
end
