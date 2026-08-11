# Atalhos do repositório. `make` sozinho lista o que existe.
#
# Só depende do que já vem no macOS — python3 e o próprio make. Não há passo de
# build: o site é estático, e servir esta pasta é tudo que precisa acontecer.
# É a mesma pasta que o GitHub Pages publica, então o que se vê aqui é o que vai
# para o ar.

PORT ?= 8000
URL  := http://localhost:$(PORT)

.DEFAULT_GOAL := help
.PHONY: help dev serve stop og favicon

help: ## lista os alvos disponíveis
	@echo "uso: make <alvo>   (porta: make dev PORT=3000)"
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-6s\033[0m %s\n", $$1, $$2}'

dev: ## sobe o site e abre no navegador
	@echo "vbmendes.dev → $(URL)   (ctrl-c para parar)"
	@( sleep 1 && open "$(URL)" ) &
	@python3 -m http.server $(PORT) --bind 127.0.0.1

serve: ## sobe o site sem abrir o navegador
	@echo "vbmendes.dev → $(URL)   (ctrl-c para parar)"
	@python3 -m http.server $(PORT) --bind 127.0.0.1

og: ## regera og.png (imagem de compartilhamento) a partir do cartão
	@sh scripts/og.sh

favicon: ## regera favicon.ico a partir do favicon.svg
	@sh scripts/favicon.sh

stop: ## mata um servidor que tenha ficado rodando em segundo plano
	@pkill -f "http.server $(PORT)" && echo "servidor na porta $(PORT) parado" \
		|| echo "nada rodando na porta $(PORT)"
