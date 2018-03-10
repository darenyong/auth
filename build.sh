#!/bin/bash

# clean out old containers and images before build
docker stop auth
docker rm auth
docker rmi auth:1.0.0

VERSION="1.0.0"
tag="auth:${VERSION}"
docker build -t ${tag} .
