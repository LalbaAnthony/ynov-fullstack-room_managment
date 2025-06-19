.PHONY: dev up down build clean logs

dev:
	docker compose -f docker-compose.yml up --build

up:
	docker compose -f docker-compose.yml up

down:
	docker compose down

build:
	docker compose build

clean:
	docker compose down -v --remove-orphans

logs:
	docker compose logs -f
