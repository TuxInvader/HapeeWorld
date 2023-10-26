function update_settings() {
    let blog_count = get_cookie('site_settings_blog_count');
    let release_count = get_cookie('site_settings_release_count');
    let allow_coffee = get_cookie('site_settings_allow_coffee');
    let coffee_action = get_cookie('site_settings_coffee_action');
    let allow_proxy_cache = get_cookie('site_settings_proxy_cache');
    let allow_local_cache = get_cookie('site_settings_local_cache');
    let proxy_max_age = get_cookie('site_settings_proxy_cache_age');
    let local_max_age = get_cookie('site_settings_local_cache_age');
    document.getElementById('homePageBlogs').value = blog_count;
    document.getElementById('aboutPageReleases').value = release_count;
    document.getElementById('proxyMaxAge').value = proxy_max_age
    document.getElementById('localMaxAge').value = local_max_age
    allow_coffee == "true" ? document.getElementById('coffeeEnabled').checked = true : document.getElementById('coffeeDisabled').checked = true;
    coffee_action == "rewrite" ? document.getElementById('coffeeRewrite').checked = true : document.getElementById('coffeeRedirect').checked = true
    allow_proxy_cache == "true" ? document.getElementById('proxyCacheEnabled').checked = true : document.getElementById('proxyCacheDisabled').checked = true
    allow_local_cache == "true" ? document.getElementById('localCacheEnabled').checked = true : document.getElementById('localCacheDisabled').checked = true
}