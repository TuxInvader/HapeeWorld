# High Availability

HA Proxy Enterprise includes a package for managing High Availability (HA) Virtual IP (VIP) Addresses. This package is called `hapee-extras-vrrp` and will be installed automatically when you use HAPEE with Fusion.

As you might guess from the name, the HA solution uses the Virtual Router Redundancy Protocol (VRRP).

## Setting up VRRP with Fusion

The VRRP configuration can be done through the Fusion UI by navigating to Quick Mode -> VRRP. But before you can configure VRRP, you need to enable it on your cluster. So, we'll do that first.

### Enable VRRP on the Cluster

Enable VRRP on your cluster by following these steps:

1. Navigate to Infrasctructure -> Clusters
2. Click on the `Edit` icon for the cluster you mean to configure.
3. Ensure that Network and Security Management -> Network Configuration is set to VRRP
4. Click the `Update` button

### Create a new VRRP instance

With VRRP enabled, we can now deploy a VRRP instance

1. Navigate to Quick Mode -> VRRP
2. Click the `Add New Instance` button
3. 