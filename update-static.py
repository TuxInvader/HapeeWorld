#!/usr/bin/env python3
import urllib.request
import json
import os

web_server="http://172.17.0.2:3000"
api_server="http://172.17.0.3:3000"
api_user="devdave"
api_pass="S0m3_n0N_R4nd0M_v4|u3"

def update_json(url, filename):
    password_mgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()
    password_mgr.add_password(None, api_server, api_user, api_pass)
    handler = urllib.request.HTTPBasicAuthHandler(password_mgr)
    opener = urllib.request.build_opener(handler)
    opener.open(url)
    urllib.request.install_opener(opener)
    items = []
    print("Fetching: " + url)
    with urllib.request.urlopen(url) as response:
        result = json.loads(response.read())
        items = result["items"]
        with open("middleware/app/apiserver/static/" + filename, "w") as file:
            json.dump(items, file)
    return items

def update_static(items):
    statics = "frontend/app/blog/assets"
    for item in items:
        for (key,value) in item.items():
            if  value.startswith("/proxy/"):
                url = "https://" + value[7:]
                print("Fetching: " + url)
                outdir = statics + '/'.join(value.split('/')[:-1])
                try:
                    os.makedirs(outdir)
                except:
                    pass
                with urllib.request.urlopen(url) as response:
                    data = response.read()
                    with open(statics + value, "wb") as file:
                        file.write(data)

                    
print("\n\nUpdating cached Blogs")
blogs = update_json(api_server + "/v1/blogs?items=10&live=true", "blogs.json")
update_static(blogs)

print("\n\nUpdating cached releases")
releases = update_json(api_server + "/v1/releases?items=10&live=true", "releases.json" )
