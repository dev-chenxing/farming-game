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

local smallUnit = units[2] .. units[3] .. units[4];
local bigUnit = units[5] .. units[9] .. units[13] .. units[17] .. units[21];
local zero = digits[1];

print(digits[1])

return function(num)
    local str = ""
    local n = math.floor(math.abs(num))
    if (n < 1) then return (num < 0 and minus or "") .. zero end
    local uc = table.copy(units);
    while (n > 0) do
        local d = n % 10; -- 数字
        local u = table.remove(uc, 1); -- 单位
        str = digits[d + 1] .. u .. str;
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
              :gsub("(" .. digits[1] .. ")+", "$1"):gsub(zero .. "+$", "")
    str = str:gsub("^" .. digits[2] .. units[2], units[2])
    return (num < 0 and minus or "") .. str;
end
