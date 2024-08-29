local worldController = require 'worldController'

game = {
    worldController = worldController,
    palette = {
        ["烟墨"] = {0.21, 0.21, 0.22}, -- #353538
        ["山矾"] = {0.96, 0.95, 0.95}, -- #F5F3F2
        ["玛瑙"] = {0.81, 0.80, 0.79}, -- #CFCCC9
        ["晓灰"] = {0.83, 0.77, 0.72}, -- #D4C4B7
        ["玉色"] = {0.92, 0.89, 0.82}, -- #EAE4D1
        ["雪白"] = {1, 0.99, 0.98} -- #FFFDFB
    },
    uiElementType = {rect = "rect", text = "text"},
    getPlayerCoins = function() return 100 end
}
