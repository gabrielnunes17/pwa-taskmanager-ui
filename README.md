# Frontend do CRUD de Usuários

Frontend simples em HTML, CSS e JavaScript que utiliza todas as rotas do backend.

## Executar

1. Inicie o backend na porta 3000.
2. Abra esta pasta em outro terminal.
3. Execute um servidor HTTP local:

```bash
npx serve .
```

4. Abra no navegador o endereço informado pelo comando.

Não abra o arquivo `index.html` diretamente. O servidor HTTP é necessário para o funcionamento correto do PWA.

## Endereço da API

O endereço está definido no início do arquivo `app.js`:

```javascript
const API_URL = "http://localhost:3000/usuarios";
```

Altere esse valor caso o backend seja executado em outro endereço ou porta.

## Operações disponíveis

| Ação | Método | Rota |
|---|---|---|
| Listar usuários | GET | `/usuarios` |
| Buscar por ID | GET | `/usuarios/:id` |
| Cadastrar | POST | `/usuarios` |
| Atualizar | PUT | `/usuarios/:id` |
| Excluir | DELETE | `/usuarios/:id` |
