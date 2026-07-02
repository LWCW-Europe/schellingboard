.PHONY: help dev build start lint typecheck lint-watch test test-unit test-integration test-watch test-coverage test-e2e test-e2e-headed format format-check precommit dev-migrate-up dev-migrate-status dev-migrate-create dev-db-seed install install-playwright clean clean-all docker-build check-and-format dev-db-reset test-e2e-ci

SHELL := /usr/bin/env bash

help:
	@printf "Available commands:\n"
	@printf "\nDevelopment:\n"
	@printf "  %-28s %s\n" "make dev"                "Start development server"
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
	bun x vitest run

test-unit: install
	bun x vitest run tests/unit

test-integration: install
	bun x vitest run tests/integration

test-watch: install
	bun x vitest

test-coverage: install
	bun x vitest run --coverage

test-e2e: install-playwright
	bun set-env.ts test bun x playwright test

test-e2e-headed: install-playwright
	bun set-env.ts test bun x playwright test --headed

format: install
	bun x prettier --write .

format-check: install
	bun x prettier --check .

precommit: format lint typecheck test test-e2e

clean:
	rm -rf .next
	rm -f next-env.d.ts
	rm -f data.db data.test.db
	rm -rf playwright-report test-results
	rm -f tsconfig.tsbuildinfo

clean-all: clean
	rm -rf node_modules

dev-migrate-up: install
	bun set-env.ts dev bun x tsx scripts/run-migrations.ts

dev-migrate-status: install
	bun set-env.ts dev bun x drizzle-kit check

dev-migrate-create: install
	bun set-env.ts dev bun x drizzle-kit generate

dev-db-seed: install
	bun set-env.ts dev bun x tsx scripts/seed-database.ts

docker-build:
	APP_VERSION=$$(git describe --tags --always --dirty) docker compose build

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
