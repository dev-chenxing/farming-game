require 'game'
require 'fonts'

function love.load()
    love.window.setMode(game.worldController.viewWidth,
                        game.worldController.viewHeight)

end

function love.draw()
    love.graphics.setBackgroundColor(game.palette["山矾"])
    love.graphics.setColor(game.palette["烟墨"])
    love.graphics.setFont(fonts["刀隶体"])
    love.graphics.print("铜钱一百文", 200, 100)
    -- love.graphics.scale(WINDOW_WIDTH / VIRTUAL_WIDTH, WINDOW_HEIGHT / VIRTUAL_HEIGHT)
    -- GameState:render()
    -- love.graphics.setColor(FPS_COLOR)
    -- love.graphics.setFont(FontPrimarySmall)
    -- love.graphics.print('FPS: ' .. tostring(love.timer.getFPS()), 40, 40)
    -- love.graphics.setColor(WHITE)
end
