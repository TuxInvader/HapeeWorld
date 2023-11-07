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


