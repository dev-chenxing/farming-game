require 'uiElement'

ui = {
    ---@param params createMenuParams
    ---@return uiElement result
    createMenu = function(params)
        local result = uiElement({
            id = params.id,
            parent = nil,
            type = game.uiElementType.rect
        })
        return result;
    end
}

---@class createMenuParams
---@field id string
