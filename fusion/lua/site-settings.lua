--- from https://github.com/haproxytech/haproxy-lua-http/blob/master/http.lua
local function parse_kv(s, sep)
    if s == nil then return nil end
    idx = 1
    result = {}

    while idx < s:len() do
        i, j = s:find(sep, idx)

        if i == nil then
            k, v = string.match(s:sub(idx), "^(.-)=(.*)$")
            if k then result[k] = v end
            break
        end

        k, v = string.match(s:sub(idx, i-1), "^(.-)=(.*)$")
        if k then result[k] = v end
        idx = j + 1
    end

    if next(result) == nil then
        return nil
    else
        return result
    end
end


local function update_settings(applet)
    local request  = applet:receive()
    local response = "Updated\n"
    local data = parse_kv(request, '&')
    for k, v in pairs(data) do
	if type(v) == "table" then
            applet.set_var( applet, "proc." .. k, copyTable(v) )
        else
            applet.set_var( applet, "proc." .. k, v )
        end
    end
    applet:set_status(302)
    applet:add_header("content-length", string.len(response))
    applet:add_header("content-type", "text/plain")
    applet:add_header("location", "/sysadmin#")
    applet:start_response()
    applet:send(response)
end


--- lua-load /var/lib/dataplaneapi/storage/general/site-settings.lua
--- http-request use-service lua.update_site_settings if sysadmin is_post
core.register_service("update_site_settings", "http", update_settings)


