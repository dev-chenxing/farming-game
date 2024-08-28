---@class uiElement
---@field id string
---@field parent uiElement?
---@field children uiElement[]?
uiElement = Class {}

function uiElement:init(params)
    self.id = params.id;
    self.parent = params.parent or nil
    self.children = nil;
    self.x = params.x or 0;
    self.y = params.y or 0;
    self.width = params.width or 0;
    self.height = params.height or 0;
    self.type = params.type or game.uiElementType.rect;
    self.color = params.color or game.palette["烟墨"]
    self.text = params.text or nil
end

function uiElement:render()
    love.graphics.setColor(self.color)
    if (self.type == game.uiElementType.rect) then
        love.graphics.rectangle("fill", self.x, self.y, self.width, self.height)
    elseif (self.type == game.uiElementType.text) then
        local text = love.graphics.newText(fonts["刀隶体"], self.text)
        self.width, self.height = text:getWidth(), text:getHeight()
        love.graphics.draw(text, self.parent.x + self.x - self.width / 2,
                           self.parent.y + self.y - self.height / 2)
    end
    if (self.children) then
        for _, element in ipairs(self.children) do element:render() end
    end
end

---@param params uiElementCreateLabelParams
---@return uiElement result
function uiElement:createLabel(params)
    local result = uiElement({
        id = params.id,
        parent = self,
        type = game.uiElementType.text,
        text = params.text
    })
    if not self.children then self.children = {} end
    table.insert(self.children, result)
    return result
end

---@class uiElementCreateLabelParams
---@field id string
---@field text string
