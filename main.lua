Class = require 'lib.hump.class'
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
    local label = body:createLabel({id = "money", text = "铜钱一百文"})
    label.x, label.y = label.parent.width / 2, label.parent.height / 4
    local backpackBlock = body:createBlock({id = "backpack"})
    backpackBlock.width, backpackBlock.height =
        game.worldController.viewWidth / 2, game.worldController.viewHeight / 4
    backpackBlock.x, backpackBlock.y = backpackBlock.parent.width / 2 -
                                           backpackBlock.width / 2, 240

    body:render()
end
