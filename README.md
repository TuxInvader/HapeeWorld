# HAPEE World Demo Site

This repository contains a set of containers and instructions for setting up a HAProxy demo environment.

![Screenshot](docs/images/screenshot.png "Screenshot")

# Containers

You will need to deploy at least 2 containers for running the demo, a single web server, and a single api server with local databases. Alternatively you may deploy multiple web and api servers along with an external mongodb database. 

## frontend container

Build the container with:
```
cd frontend
docker build -t hapeeworld-fe:latest .
```

Run the container in development mode (make changes in real time)
```
docker run --rm -ti --entrypoint /bin/bash -v ~/hapee-webapp/frontend/app/:/usr/app --env NODE_ENV=development hapeeworld-fe:latest
```
Inside the container execute `/usr/app/run.sh` to start the node app

To run the container in production mode, simply execute 
```
docker run --rm -d hapeeworld-fe:latest
```

## middleware (api) container

Build the container with:
```
cd middleware
docker build -t hapeeworld-mw:latest .
```

Run the container in development mode (make changes in real time)
```
docker run --rm -ti --entrypoint /bin/bash -v ~/hapee-webapp/middleware/app/:/usr/app --env NODE_ENV=development hapeeworld-mw:latest
```
Inside the container execute `/usr/app/run.sh` to start the node app

To run the container in production mode, simply execute 
```
docker run --rm -d hapeeworld-mw:latest
```

## Optional database for multiple containers

If you want to deploy more than one frontend, then you should deploy an external mongo database somewhere and provide a connection URL to the frontend containers by setting a DATABASE environment variable. Eg:
```
docker run --rm -d --env DATABASE=mongodb://192.168.1.100:27017/blog hapeeworld-fe:latest
```

# Fusion Configuration

## Create your cluster

If you need to setup a new cluster and deploy HAPEE nodes, then follow these steps, otherwise you can skip to [Configure the cluster](Configure-the-cluster) below.

1. Open the Fusion UI and navigate to Infrastructure -> Clusters. Then either create a new cluster for your HAPEE nodes to join or edit an existing cluster. Do one of the following:
   - Click the `New Cluster` button and give your cluster a name
   - Click the `Edit` icon for the cluster you wish to use
2. Ensure that the cluster has the correct HAPEE license key set
3. Ensure the `Configuration Validation` section is set to the HAProxy Enterprise version you want.
4. Ensure that the `Cluster Membership` section has `Auto Join` enabled
   - If the HAPEE  node is behind `NAT` device, then also select `Relaxed Node Joining`
5. Ensure a `Bootstrap Key` is enabled. Click the `Generate Bootstrap Key` if it isn't.
   - If this is a new cluster, then you need to click `create` and then come back in via the `Edit` icon before you can generate a key.
6. Click `Update`

## Deploy nodes to the cluster

If you are deploying HAPEE on local or cloud infrastructure (Bare metal or Virtual Machines), then you will need to deploy and configure the Linux hosts first. Once deployed, follow these steps:

1. Open the Fusion UI and check that you are working on the correct cluster. The current cluster name is shown in the toolbar across the top of the screen.
2. Navigate to Infrastructure -> Nodes and click `Add Node` in the top right
3. Click in the `Bare metal` text window to copy the installation script
4. Using a SSH session connect to the host where HAPEE is to be deployed and paste the script contents, and then press `<return>`.
5. If the information presented looks correct, then press `Y` to begin the installation.
6. Repeat steps 4 and 5 for any other nodes you want to add to this cluster.
7. Once complete the node should appear in the Fusion UI.

## Configure the cluster

### Create a LogExport target (optional)

Once of the many great advantages provided by Fusion are the analytics and log collection features. To make best use of features like the `Request Explorer` we first need to setup log collection. Follow these steps to do so:

1. Open the Fusion UI and navigate to Fusion Admin -> Log Export Targets
2. Click the `Add Log Export Target` button
3. Ensure that the `Haproxy` checkbox is selected.
4. Give the target a name eg "hapeelogs".
5. In the `Target Hostname/IP` box enter the IP or hostname of your Fusion instance
6. Set the `Target Port` as the syslog port 514
7. And then select `TCP` as the protocol, or `UDP` if you prefer.
8. Click on the `Create` button

Next we need to configure your cluster to use the new log target

1. Navigate to Infrastructure -> Clusters
2. Click the `Edit` button for your cluster
3. Scroll down to the `Other Settings` section
4. Set the `Log Export Target` to your newly configured target
5. Ensure the `Send HAProxy logs` option is enabled
6. Click the `Update` button.

### Customize the auxiliary scripts

The demo site uses a number of auxiliary files which configure how the site and HAProxy behave. Some of the settings take initial values from `maps` and are then dynamically updated from a special `/sysadmin` page on the site itself. 

Take a look at the following files and customize as necessary

- fusion/maps/hapeeworld-site-settings.map

### Upload the auxiliary files

We need to upload several files, prior to uploading the structured HAProxy configuration. 

1. Open the Fusion UI and navigate to `Advanced Mode` -> `Files` -> `Map Files`
2. Click the `Add New Map File` button
3. Upload the file `fusion/maps/hapeeworld-site-settings.map`

Next we want to upload out LUA script(s) and error file(s)

1. Open the Fusion UI and navigate to `Advanced Mode` -> `Files` -> `General Files`
2. Click the `Add New General File` button
3. Upload the file `fusion/lua/site-settings.lua`
4. Upload the file `fusion/errors/error-404-json.http`
5. Upload the file `fusion/errors/error-503-json.http`

### Upload the HA Proxy Configuration

Fusion has a number of interfaces and sections that enable the user to manage HA Proxy configuration elements, but it can also accept a `"raw configuration"` format, which is what we're going to deploy next. 

1. Open the Fusion UI and navigate to Advanced Mode -> Config Edit
2. Ensure you are in the `HAProxy` view and not the `Structured` view
3. Delete the current content of the code editing window
4. Copy and paste the contents from `fusion/hapeeworld-fusion.config`
5. Click the `Submit` button.

