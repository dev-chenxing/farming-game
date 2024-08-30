function table.copy(from)
    local from_type = type(from)
    local copy
    if from_type == 'table' then
        copy = {}
        for from_key, from_value in pairs(from) do
            copy[from_key] = from_value
        end
    else -- number, string, boolean, etc
        copy = from
    end
    return copy
end
