# Nordeste em Dados 3D — Observatório da Pobreza e Desigualdade Social

Site interativo (React + TypeScript + Vite) com mapa 3D dos nove estados do Nordeste, evolução histórica, comparador de estados, políticas públicas, simulador didático e modo apresentação em tela cheia. Construído a partir do documento *Pobreza e Desigualdade no Nordeste* (trabalho de Economia do Nordeste).

## Executar

```bash
npm install
npm run geo:fetch   # baixa as malhas oficiais do IBGE (opcional em dev: o app também consulta a API em tempo de execução)
npm run dev         # http://localhost:5173
```

Outros comandos: `npm test` (Vitest), `npm run typecheck`, `npm run build`, `npm run preview`.

Requisitos: Node ≥ 18.18.

## Publicar na Vercel

1. Suba o repositório no GitHub e importe o projeto na Vercel (preset **Vite**; `vercel.json` já configura build, saída `dist` e cache).
2. O script `prebuild` tenta baixar `public/data/geo/nordeste-uf.geojson` do IBGE. Se a rede falhar, o build segue e o app consulta a API do IBGE no navegador.
3. O roteamento usa *hash* (`/#/mapa`), portanto não exige regras de reescrita adicionais.

## Limites territoriais (GeoJSON oficial)

Nenhuma geometria foi desenhada à mão. O app carrega, nesta ordem:
1. `public/data/geo/nordeste-uf.geojson` (gerado por `npm run geo:fetch` a partir da API de Malhas v3 do IBGE; qualidade ajustável com `GEO_QUALITY=minima|intermediaria|maxima`);
2. a própria API do IBGE (`servicodados.ibge.gov.br/api/v3/malhas/estados/{código}`), nove requisições;
3. se ambas falharem, exibe um erro com instruções (e o restante do site continua funcional).

Sem WebGL, o mapa cai automaticamente para uma versão 2D em SVG.

## Arquitetura

```
src/
  data/            observações, fontes, metodologias, indicadores, políticas, conceitos (dados locais estruturados)
  services/        indicatorService (consultas), transforms (variação, escala/extrusão), simulator, geoService, format
  visualizations3d/ cena Three.js (React Three Fiber/Drei), legenda e fallback 2D
  charts/          gráficos Recharts (evolução e comparação)
  components/      layout, UI, KpiCard, ficha do estado
  pages/           Home, Mapa, Evolução, Comparar, Políticas, Simulador, Apresentação
  hooks/ types/ config/ styles/ __tests__/
```

A camada de dados é independente da interface e do motor 3D: `createIndicatorService(observations)` recebe qualquer lista de observações. Para integrar APIs oficiais (SIDRA/PNAD Contínua), basta gerar `Observation[]` a partir delas e injetar no serviço.

## Modelo de dados e regras de confiabilidade

Cada `Observation` tem indicador, valor, ano, território, unidade, `fonteId` (com link original) e `metodologiaId` (linha de pobreza, base de preços, pesquisa).

- **Sem valores inventados:** ausência de dado = nenhuma linha. A interface mostra “Dado não disponível”.
- **Sem interpolação:** gráficos deixam lacunas; a linha tracejada opcional só liga pontos observados.
- **Sem mistura de metodologias:** IBGE (US$ 6,85/dia), FGV IBRE (US$ 5,50/dia), extrema pobreza (US$ 2,15/dia) e Banco Mundial/ALC são séries separadas; variações só são calculadas dentro da mesma metodologia.
- **Políticas:** não se atribui queda da pobreza a nenhum programa; resultados citados trazem ressalvas.

### Base inicial (todos os valores vêm do documento Word)

| Recorte | Anos | Fonte / linha |
|---|---|---|
| Pobreza e extrema pobreza, Brasil e Nordeste | 2023, 2024 | IBGE – SIS (US$ 6,85 e 2,15) |
| Pobreza e extrema pobreza no Nordeste | 2012, 2024 | FGV IBRE (US$ 5,50 e 2,15) |
| Extrema pobreza, Nordeste (nº de pessoas) | 2012, 2019, 2021, 2023 | FGV IBRE |
| Pessoas em pobreza, 9 estados | 2012, 2023 | FGV IBRE (Tabela 3) |
| Taxa de pobreza por estado | 2024 (MA, CE, AL, RN, BA) | FGV IBRE (US$ 5,50) |
| Gini | 2022 (Brasil e Nordeste) | IBGE/Censo 2022 via G1 |
| Informalidade | 2025 (Maranhão) | IBGE via G1 MA |
| Pobreza, América Latina e Caribe | 2024 | Banco Mundial (US$ 6,85) |

**Lacunas conhecidas:** renda por estado, Gini estadual, extrema pobreza estadual, informalidade dos demais estados, taxas de PI, PB, PE, SE e série anual completa. Para preenchê-las, acrescente linhas em `src/data/observations.ts` a partir de SIDRA/PNAD Contínua, Ipea, IMESC, PNUD ou Banco Mundial; o mapa, a linha do tempo e os comparadores passam a usá-las automaticamente (a linha do tempo se expande para anos posteriores a 2024).

Pendências de fonte registradas no próprio código: o link original do infográfico de Gini não consta nas referências do documento; os links de Ceará e Bahia no documento são genéricos.

## Simulador

Didático, não é previsão. As linhas oficiais são em US$/dia (PPC 2017); para convertê-las em R$/mês o simulador usa um **fator ilustrativo e editável** (`FATOR_PPC_ILUSTRATIVO` em `src/services/simulator.ts`) — não é um dado oficial. Há também a opção de linha personalizada em R$.

## Modo apresentação

Rota `#/apresentacao`: 6 etapas, tela cheia (F), setas/espaço para navegar, `N` para notas do apresentador, `Esc` para sair.

## Testes

`src/__tests__` cobre variação percentual/absoluta, recusa de comparações entre metodologias, escala de extrusão proporcional, ausência de interpolação, integridade da base (fontes/metodologias existentes, sem duplicatas), simulador e a transformação geográfica.
