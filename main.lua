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
    label.x, label.y = label.parent.width / 2, label.parent.height / 2
    body:render()
end
