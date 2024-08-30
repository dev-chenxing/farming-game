Class = require 'lib.hump.class'
require '.table'
intToChinese = require 'lib.chenxing.intToChinese'
require 'game'
require 'fonts'
require 'ui'

function love.load()
    love.window.setMode(game.worldController.viewWidth,
                        game.worldController.viewHeight)

end

function love.draw()
    local body = ui.createMenu({id = "body"})
    body.color = game.palette["山矾"]
    body.width, body.height = game.worldController.viewWidth,
                              game.worldController.viewHeight
    local sidebar = body:createRect({
        id = "sidebar",
        color = game.palette["玛瑙"]
    })
    sidebar.width, sidebar.height = 256, sidebar.parent.height
    local main = body:createRect({id = "main", color = game.palette["雪白"]})
    main.x = sidebar.width
    main.width, main.height = main.parent.width - sidebar.width,
                              main.parent.height
    local yearLabel = sidebar:createLabel({
        id = "year",
        text = "开皇元年·冬"
    })
    yearLabel.x, yearLabel.y = yearLabel.parent.width / 2, 64
    local dateLabel = sidebar:createLabel({
        id = "date",
        text = "十二月二十四" -- 十月初四，正月十五
    })
    dateLabel.x, dateLabel.y = dateLabel.parent.width / 2, 96
    local moneyLabel = sidebar:createLabel({
        id = "money",
        text = string.format("铜钱%s文", intToChinese(game.getPlayerCoins()))
    })
    moneyLabel.x, moneyLabel.y = moneyLabel.parent.width / 2, 160
    local backpackRect = main:createRect({
        id = "backpack",
        color = game.palette["山矾"]
    })
    backpackRect.width, backpackRect.height = backpackRect.parent.width, 128
    backpackRect.y = backpackRect.parent.height - backpackRect.height
    local block = main:createBlock({id = "block"})
    block.width, block.height = block.parent.width,
                                block.parent.height - backpackRect.height

    body:render()
end
