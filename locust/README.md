# Locust tests

The `hapee-locust.py` file is a python `locustfile` for use with the [Locust](https://locust.io/) load testing tool
 
You will need to edit the `host`, and `apihost` variables to match your deployments hostnames

Setup and run in a Python3 virtualenv:
```
cd locust/
python3 -m virtualenv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

Then you can start locust by running the following command
```
locust -f hapee-locust.py
```

You can also execute the script directly to have a single client access the site.
```
python3 hapee-locust.py
```

## Usage with socks

If you want to use a socks proxy/proxies for some/all of the requests, then you can set the following environment variables

```
LOCUST_USE_SOCKS=50                            # percentage of requests to use proxy for (0-100)
LOCUST_SOCKS_HOSTS=s1.london.com,s1.paris.com  # CSV list of socks hosts to use
LOCUST_SOCKS_AUTH=user:password                # authentication user:password
LOCUST_SOCKS_PORT=1080                         # socks listening port
```
