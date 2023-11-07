#!/usr/bin/env python

import time
from locust import HttpUser, task, between, run_single_user

class QuickstartUser(HttpUser):
    wait_time = between(1, 5)
    host = "http://www.hapee.world"
    apihost = "http://api.hapee.world"

    pages = {
      "homepage": {
         "url": "/",
         "resources": [
          "/css/custom.css",
          "/css/styles.css",
          "/js/colormode.js",
          "/js/popper.min.js",
          "/js/bootstrap.min.js",
          "/js/apicrud.js",
          "/js/vis-network.min.js",
          "/images/hapee-world.png",
          "/images/loady.png",
          "/images/home-slide1.png",
          "/images/home-slide2.png",
          "/images/home-slide3.png",
          apihost + "/v1/blogs",
          "/proxy/cdn.haproxy.com/img/containers/partner_integrations/2023/why-your-load-balancer-should-be-fast-and-flexible/artboard_1_copy.png/21d0b5161ee01250cef17671f707b355.webp",
          "/proxy/cdn.haproxy.com/img/containers/partner_integrations/how-to-extract-insightful-data-from-proxy-protocol-image.png/ddc176e22db8be92ba916bc5e302f73c.webp",
          "/proxy/cdn.haproxy.com/img/containers/partner_integrations/g2-2023-summer-reports-security-leadership-3.png/7cfd45efb491ed5c4949380f6775b922.webp",
          "/proxy/cdn.haproxy.com/img/containers/partner_integrations/haproxy-is-not-affected-by-the-http2-rapid-reset.png/b7d8f25bb2e4c330274e1d1ca330c386.webp",
          "/images/haproxy-icon.svg"
         ]
      },
      "tea": {
        "url": "/tea",
        "resources": [
          "/css/custom.css",
          "/css/styles.css",
          "/js/colormode.js",
          "/js/popper.min.js",
          "/js/bootstrap.min.js",
          "/js/apicrud.js",
          "/js/vis-network.min.js",
          "/images/hapee-world.png",
          "/images/loady.png",
          "/images/tea1.jpg",
          "/images/haproxy-icon.svg"
        ]
      },
      "coffee": {
        "url": "/coffee",
        "resources": [
          "/css/custom.css",
          "/css/styles.css",
          "/js/colormode.js",
          "/js/popper.min.js",
          "/js/bootstrap.min.js",
          "/js/apicrud.js",
          "/js/vis-network.min.js",
          "/images/hapee-world.png",
          "/images/loady.png",
          "/images/coffee1.jpg",
          "/images/haproxy-icon.svg"
        ]
      },
      "about": {
        "url": "/about",
        "resources": [
          "/css/custom.css",
          "/css/styles.css",
          "/js/colormode.js",
          "/js/popper.min.js",
          "/js/bootstrap.min.js",
          "/js/apicrud.js",
          "/js/vis-network.min.js",
          "/images/hapee-world.png",
          "/images/loady.png",
          apihost + "/v1/releases",
          "/images/haproxy-icon.svg"
        ]
      }
    }

    def get_page(self, pagename):
        page = self.pages[ pagename ]
        self.client.get(page["url"])
        for resource in page["resources"]:
          self.client.get(resource)

    @task
    def hapee_world_home(self):
      self.get_page("homepage")

    @task
    def hapee_world_tea(self):
      self.get_page("tea")

    @task
    def hapee_world_coffee(self):
      self.get_page("coffee")

    @task
    def hapee_world_about(self):
      self.get_page("about")

    def on_start(self):
      self.get_page("homepage")
        
if __name__ == "__main__":
    run_single_user(QuickstartUser)

