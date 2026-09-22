const API_URL = "https://pwa-taskmanager-api.onrender.com/tasks";

const formulario = document.querySelector("#form-task");
const campoId = document.querySelector("#task-id");
const campoTitulo = document.querySelector("#titulo");
const campoDescricao = document.querySelector("#descricao");
const campoAtivo = document.querySelector("#ativo");
const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoSalvar = document.querySelector("#botao-salvar");
const botaoCancelar = document.querySelector("#botao-cancelar");
const listatasks = document.querySelector("#lista-usuarios");
const mensagem = document.querySelector("#mensagem");
const formularioBusca = document.querySelector("#form-busca");
const campoBuscaId = document.querySelector("#busca-id");

async function fazerRequisicao(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.mensagem || "Não foi possível concluir a operação");
  }

  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
}

function criarCartaoTarefa(task) {
  const cartao = document.createElement("article");
  cartao.className = "task";

  const titulo = document.createElement("h3");
  titulo.textContent = task.titulo;

  const descricao = document.createElement("p");
  descricao.textContent = task.descricao;

  const ativo = document.createElement("p");
  ativo.textContent = `Status: ${task.ativo ? "Concluído" : "Não concluído"}`;

  const id = document.createElement("p");
  id.textContent = `ID: ${task._id}`;

  const acoes = document.createElement("div");
  acoes.className = "acoes-task";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () => carregartaskParaEdicao(task._id));

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "perigo";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.addEventListener("click", () => excluirtask(task._id));

  acoes.append(botaoEditar, botaoExcluir);
  cartao.append(titulo, descricao, ativo, id, acoes);

  return cartao;
}

function exibirtasks(tasks) {
  listatasks.innerHTML = "";

  if (tasks.length === 0) {
    mostrarMensagem("Nenhuma tarefa cadastrada");
    return;
  }

  tasks.forEach((task) => {
    listatasks.appendChild(criarCartaoTarefa(task));
  });

  mostrarMensagem(`${tasks.length} tarefas encontradas`);
}

async function listartasks() {
  try {
    mostrarMensagem("Carregando tarefas...");
    const tasks = await fazerRequisicao(API_URL);
    exibirtasks(tasks);
  } catch (erro) {
    listatasks.innerHTML = "";
    mostrarMensagem(erro.message, true);
  }
}

async function buscartaskPorId(id) {
  const task = await fazerRequisicao(`${API_URL}/${id}`);
  exibirtasks([task]);
  return task;
}

async function salvartask(evento) {
  evento.preventDefault();

  const task = {
    titulo: campoTitulo.value.trim(),
    descricao: campoDescricao.value.trim(),
    ativo: campoAtivo.checked,
  };

  const id = campoId.value;
  const estaEditando = Boolean(id);
  const url = estaEditando ? `${API_URL}/${id}` : API_URL;
  const metodo = estaEditando ? "PUT" : "POST";

  try {
    await fazerRequisicao(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    limparFormulario();
    mostrarMensagem(estaEditando ? "Tarefa atualizada" : "Tarefa cadastrada");
    await listartasks();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function carregartaskParaEdicao(id) {
  try {
    const task = await fazerRequisicao(`${API_URL}/${id}`);

    campoId.value = task._id;
    campoTitulo.value = task.titulo;
    campoDescricao.value = task.descricao;
    campoAtivo.checked = Boolean(task.ativo);
    tituloFormulario.textContent = "Editar tarefa";
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.classList.remove("oculto");
    campoTitulo.focus();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function excluirtask(id) {
  const confirmou = window.confirm("Deseja excluir esta tarefa?");

  if (!confirmou) {
    return;
  }

  try {
    await fazerRequisicao(`${API_URL}/${id}`, { method: "DELETE" });
    limparFormulario();
    mostrarMensagem("Tarefa excluída");
    await listartasks();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

function limparFormulario() {
  formulario.reset();
  campoId.value = "";
  campoAtivo.checked = true;
  tituloFormulario.textContent = "Nova Tarefa";
  botaoSalvar.textContent = "Cadastrar";
  botaoCancelar.classList.add("oculto");
}

formulario.addEventListener("submit", salvartask);
botaoCancelar.addEventListener("click", limparFormulario);
document
  .querySelector("#botao-atualizar")
  .addEventListener("click", listartasks);
document.querySelector("#botao-limpar-busca").addEventListener("click", () => {
  campoBuscaId.value = "";
  listartasks();
});

formularioBusca.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const id = campoBuscaId.value.trim();

  if (!id) {
    mostrarMensagem("Informe um ID para realizar a busca", true);
    return;
  }

  try {
    await buscartaskPorId(id);
  } catch (erro) {
    listatasks.innerHTML = "";
    mostrarMensagem(erro.message, true);
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

listartasks();
