.PHONY: build
build: ## Build the production docker image.
	docker compose build

.PHONY: start
start: ## Start the production docker container.
	docker compose up -d

.PHONY: stop
stop: ## Stop the production docker container.
	docker compose down