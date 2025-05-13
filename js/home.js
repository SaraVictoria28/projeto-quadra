import { db, auth } from "./firebase-config.js";
import {
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const reservaBtn = document.getElementById("reservar-btn");
const erroReserva = document.getElementById("erro-reserva");

reservaBtn.addEventListener("click", async () => {
  const nome = document.getElementById("reservar-nome").value;
  const quadra = document.getElementById("reservar-quadra").value;
  const esporte = document.getElementById("reservar-esporte").value;
  const data = document.getElementById("reservar-data").value;
  const hora = document.getElementById("reservar-horario").value;

    // ... outras declarações ...
  console.log("Valor do nome:", nome);
  console.log("Valor da hora:", hora); // Adicione esta linha
  // ... restante do código ...
  if (!nome || !quadra || !esporte || !data || !hora) {
    erroReserva.textContent = "Por favor, preencha todos os campos.";
    return;
  }

  try {
    const user = auth.currentUser;

    if (!user) {
      erroReserva.textContent = "Você precisa estar logado para reservar.";
      return;
    }

    const reservaRef = ref(db, `reservas/${user.uid}`);
    await push(reservaRef, {
      nome,
      quadra,
      esporte,
      data,
      hora,
      criadoEm: new Date().toISOString(),
    });

    erroReserva.textContent = "Reserva realizada com sucesso!";
  } catch (error) {
    erroReserva.textContent = "Erro ao reservar: " + error.message;
  }
});
