#!/usr/bin/env python

import time
import os
from faker import Faker
from random import randint, choice
from locust import HttpUser, task, between, run_single_user
from locust.clients import HttpSession

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
      },
      "login": {
        "url": "/login",
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
          "/images/haproxy-icon.svg"
        ]
      },
      "register": {
        "url": "/register",
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
          "/images/haproxy-icon.svg"
        ]
      }
    }

    def set_proxies(self):
      self.proxies = {}
      use_socks = int(os.getenv("LOCUST_USE_SOCKS"))
      if ( use_socks >= 0):
        if ( randint(1,100) <= use_socks ):
          host = choice(os.getenv("LOCUST_SOCKS_HOSTS").split(','))
          auth = os.getenv("LOCUST_SOCKS_AUTH")
          port = os.getenv("LOCUST_SOCKS_PORT")
          proxy = "socks5://"
          if ( auth ):
            proxy += auth + "@"
          proxy += host
          if ( port ):
            proxy += ":" + port
          self.proxies = { "http": proxy, "https": proxy }

    def get_page(self, pagename):
        self.set_proxies()
        page = self.pages[ pagename ]
        self.client.request("GET", page["url"], proxies=self.proxies)
        for resource in page["resources"]:
          self.client.request("GET", resource, proxies=self.proxies)

    def gen_person(self):
        fake = Faker()
        person = {}
        gs = randint(0,2)
        if ( gs == 0 ):
          person["gender"] = "Male"
          person["firstname"] = fake.first_name_male()
        elif ( gs == 1 ):
          person["gender"] ="Female"
          person["firstname"] = fake.first_name_female()
        else:
          person["gender"] = "nonbinary"
          person["firstname"] = fake.first_name_nonbinary()
        person["lastname"] = fake.last_name()
        person["passwd"] = fake.password()
        domain = fake.domain_name()
        if ( randint(0,1) == 0):
          person["email"] = person["firstname"][0] + "." + person["lastname"] + "@" + domain
        else:
           person["email"] = person["firstname"] + "." + person["lastname"] + "@" + domain
        person["name"] = person["firstname"] + " " + person["lastname"]
        return person
    
    @task(1)
    def hapee_world_login(self):
      self.get_page("login")
      person = self.gen_person()
      self.client.request("POST", "/login", data={"email": person["email"], "password": person["passwd"]},  proxies=self.proxies)

    @task(1)
    def hapee_world_register(self):
      self.get_page("register")
      person = self.gen_person()
      self.client.request("POST", "/register", data={"email": person["email"], "password": person["passwd"], "name": person["name"]},  proxies=self.proxies)

    @task(10)
    def hapee_world_home(self):
      self.get_page("homepage")

    @task(15)
    def hapee_world_tea(self):
      self.get_page("tea")

    @task(15)
    def hapee_world_coffee(self):
      self.get_page("coffee")

    @task(15)
    def hapee_world_about(self):
      self.get_page("about")

    def on_start(self):
      self.get_page("homepage")

if __name__ == "__main__":
    run_single_user(QuickstartUser)

