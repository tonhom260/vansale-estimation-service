# Variables
DOCKER_IMAGE := vansale-est
DOCKER_USERNAME := tonhom260

# TAG := 1.0 # bug fix
TAG := 1.1 # เพิ่ม main list page
 

DOCKERFILE := Dockerfile
REGISTRY := docker.io
PLATFORM := linux/amd64  #
IMAGE_TAG := ghcr.io/$(DOCKER_USERNAME)/$(DOCKER_IMAGE):$(TAG)

prune:
	@echo "Buildx prune"
	docker buildx du
	docker buildx prune --all	

buildx:
	@echo "Buildx the Docker image and push to repo... $(DOCKER_USERNAME)/$(DOCKER_IMAGE):$(TAG)"	
	docker buildx build --network host  --push --platform linux/amd64 -t ghcr.io/$(DOCKER_USERNAME)/$(DOCKER_IMAGE):$(TAG) .
clean:
	@echo "Cleaning up dangling Docker images..."
	docker image prune -f

login:
	@echo "Logging into Docker Hub..."
	docker login ghcr.io -u $(DOCKER_USERNAME)

update:
	@./script.sh $(TAG)

deploy: buildx update

.PHONY: buildx clean login deploy prune 