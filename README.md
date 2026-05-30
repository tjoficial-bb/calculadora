# TJ INVEST - Inteligência em Leilões 📊

Este é o simulador financeiro e de viabilidade de leilões da **TJ INVEST**. Ele foi otimizado para ser leve, rápido, totalmente responsivo e altamente intuitivo, incluindo formatação de moeda brasileira (BRL) dinâmica em tempo real nos inputs e uma matriz de análise de sensibilidade avançada.

---

## 🚀 Resolvido: Problema de Carregamento na Hospedagem

Anteriormente, ao fazer o upload dos arquivos compilados em alguns servidores ou subpastas de hospedagem, a tela podia ficar branca (sem carregar os recursos de estilo e script). 

**O que causava isso:** O Vite, por padrão, gera caminhos absolutos começando com `/` (ex: `/assets/index-xyz.js`), fazendo com que o navegador procure os arquivos na raiz absoluta do domínio, falhando quando hospedado em subpastas ou caminhos relativos.

**Como foi corrigido:** Configuramos `base: './'` no seu arquivo `vite.config.ts`. Agora, todos os caminhos de arquivos JS, CSS e imagens são gerados de forma **relativa**. O simulador funcionará perfeitamente em qualquer servidor de hospedagem (cPanel, HostGator, Vercel, Netlify, GitHub Pages) ou mesmo rodando localmente de forma estática!

---

## 🛠️ Como Atualizar seu Projeto via Git (Passo a Passo)

Para manter o seu código atualizado no seu repositório Git e sincronizar as novas modificações, siga o guia correspondente abaixo:

### Caso 1: Se você já tem o repositório clonado na sua máquina
Basta baixar/exportar os arquivos atualizados aqui do AI Studio (usando o botão de download no menu superior) e sobrescrever os arquivos na pasta local do seu computador. Em seguida, execute as seguintes etapas no terminal:

1. **Verifique os arquivos alterados:**
   ```bash
   git status
   ```

2. **Adicione as alterações ao histórico:**
   ```bash
   git add .
   ```

3. **Crie o commit com uma mensagem descritiva:**
   ```bash
   git commit -m "Ajuste do base path para caminhos relativos no Vite (correção de carregamento na hospedagem) e novos inputs em BRL"
   ```

4. **Envie as atualizações para o seu repositório remoto (ex: GitHub):**
   ```bash
   git push origin main
   ```
   *(Caso a sua branch principal se chame `master`, utilize `git push origin master`)*

---

### Caso 2: Se você estiver iniciando o repositório Git agora do zero
Se você ainda não Git na sua pasta local, inicialize-a com os seguintes comandos:

1. **Inicialize o repositório local:**
   ```bash
   git init
   ```

2. **Adicione os arquivos do projeto:**
   ```bash
   git add .
   ```

3. **Crie o seu primeiro commit:**
   ```bash
   git commit -m "Initial commit - Simulador Financeiro TJ INVEST com caminhos relativos e inputs BRL"
   ```

4. **Defina a branch principal como `main`:**
   ```bash
   git branch -M main
   ```

5. **Associe ao seu repositório no GitHub/Gitlab:**
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   ```

6. **Envie para o servidor:**
   ```bash
   git push -u origin main
   ```

---

## 📦 Como Gerar e Publicar a Versão de Produção (Build)

Ao atualizar o Git ou sua hospedagem, o simulador agora compila **diretamente na raiz do projeto** (gerando `/index.html` e `/assets/` na raiz do seu repositório). 

Isso significa que **você pode simplesmente enviar ou sincronizar a pasta inteira do seu projeto (via FTP ou Git)** para o seu servidor, e ele abrirá instantaneamente sem precisar configurar subpastas ou builds na sua hospedagem!

### Passo a passo para gerar a build e subir para sua Hospedagem:

1. **Instale as dependências (necessário apenas na primeira vez):**
   ```bash
   npm install
   ```

2. **Gere a versão de produção otimizada:**
   ```bash
   npm run build
   ```

3. **Pronto! Suba os arquivos para seu servidor:**
   * Este comando atualizará os arquivos **`index.html`** e a pasta de arquivos **`assets/`** diretamente no diretório principal (raiz) do seu projeto.
   * **Agora, basta enviar todos os arquivos da raiz do projeto para o seu painel de hospedagem (cPanel, Hostinger FTP, etc.), ou simplesmente dar `git push` no seu repositório Git!** A hospedagem detectará o arquivo `index.html` na raiz automaticamente e carregará tudo com caminhos de arquivos relativos 100% funcionais!
