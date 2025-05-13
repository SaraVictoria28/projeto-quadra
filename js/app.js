import { login, cadastrarUsuario } from "./auth.js";

const loginBtn = document.getElementById("btn-login");
const cadastrarBtn = document.getElementById("cadastro-btn");
const loginError = document.getElementById("erro-login");
const cadastrarError = document.getElementById("erro-cadastro");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;

    const result = await login(email, senha);

    if (result.success) {
      window.location.href = "home.html";
    } else {
      loginError.textContent = "Erro: " + result.message;
    }
  });
}

if (cadastrarBtn) {
  cadastrarBtn.addEventListener("click", async () => {
    const senha = document.getElementById("nova-senha").value;
    const email = document.getElementById("novo-email").value;
    const nome = document.getElementById("novo-nome").value;

    const result = await cadastrarUsuario(nome, email, senha);

    if (result.success) {
      cadastrarError.textContent =
        "Usuário criado com sucesso! Agora faça login.";
      window.location.href = "home.html";
    } else {
      cadastrarError.textContent = "Erro: " + result.message;
    }
  });
}
