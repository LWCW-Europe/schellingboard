.PHONY: help dev mailpit build start lint typecheck lint-watch test test-unit test-integration test-watch test-coverage test-e2e test-e2e-headed format format-check precommit dev-migrate-up dev-migrate-status dev-migrate-create dev-db-seed install install-playwright clean clean-all docker-build check-and-format dev-db-reset test-e2e-ci docs docs-build docs-validate www

SHELL := /usr/bin/env bash

help:
	@printf "Available commands:\n"
	@printf "\nDevelopment:\n"
	@printf "  %-28s %s\n" "make dev"                "Start development server"
	@printf "  %-28s %s\n" "make mailpit"            "Start local mail server (for email in dev and tests)"
	@printf "  %-28s %s\n" "make precommit"          "Format, lint, typecheck, and run all tests (incl. e2e)"
	@printf "\nBuilding:\n"
	@printf "  %-28s %s\n" "make build"              "Build for production"
	@printf "  %-28s %s\n" "make start"              "Start production server"
	@printf "\nTesting:\n"
	@printf "  %-28s %s\n" "make test"               "Run all unit and integration tests"
	@printf "  %-28s %s\n" "make test-unit"          "Run unit tests only"
	@printf "  %-28s %s\n" "make test-integration"   "Run integration tests only"
	@printf "  %-28s %s\n" "make test-e2e"           "Run E2E tests (headless)"
	@printf "  %-28s %s\n" "make test-e2e-headed"    "Run E2E tests (headed, for local dev)"
	@printf "  %-28s %s\n" "make test-watch"         "Run tests in watch mode"
	@printf "  %-28s %s\n" "make test-coverage"      "Run tests with coverage"
	@printf "\nLinting & Formatting:\n"
	@printf "  %-28s %s\n" "make lint"               "Run linter"
	@printf "  %-28s %s\n" "make lint-watch"         "Run linter in watch mode"
	@printf "  %-28s %s\n" "make typecheck"          "Run TypeScript type checking"
	@printf "  %-28s %s\n" "make format"             "Format code"
	@printf "  %-28s %s\n" "make format-check"       "Check code formatting"
	@printf "\nDatabase:\n"
	@printf "  %-28s %s\n" "make dev-migrate-up"     "Run migrations"
	@printf "  %-28s %s\n" "make dev-migrate-status" "Check migration status"
	@printf "  %-28s %s\n" "make dev-migrate-create" "Generate new migration"
	@printf "  %-28s %s\n" "make dev-db-seed"        "Reset dev database and seed dummy data"
	@printf "\nDocumentation site:\n"
	@printf "  %-28s %s\n" "make docs"               "Preview the docs in docs/public"
	@printf "  %-28s %s\n" "make docs-build"         "Build the public docs site into site/"
	@printf "  %-28s %s\n" "make docs-validate"      "Check the docs for broken links"
	@printf "\nLanding page:\n"
	@printf "  %-28s %s\n" "make www"               "Build schellingboard.org into www-site/"
	@printf "\nDependencies:\n"
	@printf "  %-28s %s\n" "make install"            "Install dependencies"
	@printf "  %-28s %s\n" "make install-playwright" "Install Playwright browsers"
	@printf "\nDocker:\n"
	@printf "  %-28s %s\n" "make docker-build"       "Build Docker image (tags with git describe output)"
	@printf "\nCleanup:\n"
	@printf "  %-28s %s\n" "make clean"              "Remove dev and build artifacts as well as test output"
	@printf "  %-28s %s\n" "make clean-all"          "Clean + remove node_modules"

install:
	bun install --frozen-lockfile

install-playwright: install
	bun x playwright install

dev: dev-migrate-up install
	bun set-env.ts dev bun x next dev

# `docker compose` only auto-reads `.env`, so point it at `.env.dev.local`
# instead — that way one file per clone carries MAILPIT_SMTP_PORT/MAILPIT_UI_PORT
# (and COMPOSE_PROJECT_NAME), letting several clones run mailpit side by side.
# The flag is conditional because compose errors out on a missing --env-file.
mailpit:
	docker compose $(if $(wildcard .env.dev.local),--env-file .env.dev.local,) up mailpit

build: install
	bun x next build

start: install
	bun set-env.ts production bun x next start

lint: install
	bun x eslint --max-warnings 0 .

typecheck: install
	rm -rf .next/dev/types
	bun x next typegen
	bun x tsc --noEmit

lint-watch: install
	watchexec -c -w app -w db -w utils -w tests "bun x eslint --fix ."

test: install
	bun set-env.ts test bun x vitest run

test-unit: install
	bun set-env.ts test bun x vitest run tests/unit

test-integration: install
	bun set-env.ts test bun x vitest run tests/integration

test-watch: install
	bun set-env.ts test bun x vitest

test-coverage: install
	bun set-env.ts test bun x vitest run --coverage

test-e2e: install-playwright
	bun set-env.ts test bun x playwright test

test-e2e-headed: install-playwright
	bun set-env.ts test bun x playwright test --headed

format: install
	bun x prettier --write .

format-check: install
	bun x prettier --check .

precommit: format lint typecheck test-coverage test-e2e

clean:
	rm -rf .next
	rm -f next-env.d.ts
	rm -f data.db data.test.db
	rm -rf playwright-report test-results
	rm -f tsconfig.tsbuildinfo
	rm -rf site

clean-all: clean
	rm -rf node_modules

dev-migrate-up: install
	bun set-env.ts dev bun x tsx scripts/run-migrations.ts

dev-migrate-status: install
	bun set-env.ts dev bun x drizzle-kit check

dev-migrate-create: install
	bun set-env.ts dev bun x drizzle-kit generate $(if $(NAME),--name $(NAME),)

dev-db-seed: install
	bun set-env.ts dev bun x tsx scripts/seed-database.ts

# docs/public is the only copy of the documentation; released versions are
# rebuilt from git tags (see scripts/build-docs.sh), so these two targets see
# the working tree alone.
# DOCMD_CONTAINER is the only switch docmd offers for "don't open a browser";
# `make dev` doesn't either, so keep them consistent.
# docmd doesn't copy docs/screenshots/ or docs/logo/ (see the note above
# scripts/build-docs.sh), so those references 404 in the dev server unless we
# copy them into its output ourselves. `rm -rf site` first, then wait for
# docmd's own initial build to (re)create site/index.html, closes the race
# where our copy lands before docmd's fresh build and gets wiped by it.
docs: install
	@rm -rf site
	@( DOCMD_CONTAINER=true bun x docmd dev & \
	   pid=$$!; \
	   trap 'kill $$pid 2>/dev/null' INT TERM; \
	   until [ -f site/index.html ]; do sleep 0.2; done; \
	   cp -R docs/screenshots site/screenshots; \
	   rm -f site/screenshots/README.md; \
	   cp -R docs/logo site/logo; \
	   rm -f site/logo/README.md; \
	   wait $$pid )

docs-build: install
	bash scripts/build-docs.sh

docs-validate: install
	bun x docmd validate

# Hand-written HTML plus a copy step — no toolchain, so no `install` dependency.
# The output is static and link-relative; open www-site/index.html to preview.
www:
	bash scripts/build-www.sh

docker-build:
	$(eval APP_VERSION := $(shell git describe --tags --always --dirty))
	APP_VERSION=$(APP_VERSION) docker compose build
	docker tag schellingboard/schellingboard:latest schellingboard/schellingboard:$(APP_VERSION)

# Deprecated aliases (hidden from help) — remove after a deprecation period.
# They print a warning pointing to the new name, then run it.
check-and-format:
	@echo "⚠️  'make check-and-format' is deprecated; use 'make precommit'" >&2
	@$(MAKE) precommit

dev-db-reset:
	@echo "⚠️  'make dev-db-reset' is deprecated; use 'make dev-db-seed'" >&2
	@$(MAKE) dev-db-seed

test-e2e-ci:
	@echo "⚠️  'make test-e2e-ci' is deprecated; use 'make test-e2e'" >&2
	@$(MAKE) test-e2e
