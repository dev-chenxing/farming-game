require 'game'

function love.load()
    love.window.setMode(game.worldController.viewWidth,
                        game.worldController.viewHeight, {borderless = true})
end

function love.draw()
  love.graphics.setBackgroundColor(game.palette.black)
  love.graphics.setFont(FontPrimarySmall)
  love.graphics.scale(WINDOW_WIDTH / VIRTUAL_WIDTH, WINDOW_HEIGHT / VIRTUAL_HEIGHT)
  GameState:render()
  love.graphics.setColor(FPS_COLOR)
  love.graphics.setFont(FontPrimarySmall)
  love.graphics.print('FPS: ' .. tostring(love.timer.getFPS()), 40, 40)
  love.graphics.setColor(WHITE)
end