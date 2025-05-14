import { db, auth } from "./firebase-config.js";
import {
  ref,
  push,
  get,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const reservaBtn = document.getElementById("reservar-btn");
const erroReserva = document.getElementById("erro-reserva");
const quadraInput = document.getElementById("reservar-quadra");
const dataInput = document.getElementById("reservar-data");
const horarioSelect = document.getElementById("reservar-horario");

reservaBtn.addEventListener("click", async () => {
  const nome = document.getElementById("reservar-nome").value;
  const quadra = quadraInput.value;
  const esporte = document.getElementById("reservar-esporte").value;
  const data = dataInput.value;
  const hora = horarioSelect.value; // Use o valor selecionado no select

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

    // Verificar se o horário já está reservado para a quadra e data selecionadas
    const reservasRef = ref(db, "reservas");
    const snapshot = await get(reservasRef);
    let horarioJaReservado = false;

    if (snapshot.exists()) {
      snapshot.forEach((userSnapshot) => {
        userSnapshot.forEach((reservaSnapshot) => {
          const reserva = reservaSnapshot.val();
          if (
            reserva.quadra === quadra &&
            reserva.data === data &&
            reserva.hora === hora
          ) {
            horarioJaReservado = true;
          }
        });
      });
    }

    if (horarioJaReservado) {
      erroReserva.textContent =
        "Este horário já está reservado para esta quadra e data.";
      return;
    }

    const reservaUserRef = ref(db, `reservas/${user.uid}`);
    await push(reservaUserRef, {
      nome,
      quadra,
      esporte,
      data,
      hora,
      criadoEm: new Date().toISOString(),
    });

    erroReserva.textContent = "Reserva realizada com sucesso!";
    // Atualizar os horários disponíveis após uma reserva bem-sucedida
    atualizarHorariosDisponiveis();
  } catch (error) {
    erroReserva.textContent = "Erro ao reservar: " + error.message;
  }
});

const btnReservas = document.getElementById("minhas-reservas");

btnReservas.addEventListener("click", () => {
  window.location.href = "reservas.html";
});

const sair = document.getElementById("sair");

sair.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Atualiza os horários disponíveis com base nas reservas já feitas
async function atualizarHorariosDisponiveis() {
  const quadra = quadraInput.value;
  const data = dataInput.value;

  if (!quadra || !data) return;

  const reservasRef = ref(db, "reservas");
  const snapshot = await get(reservasRef);

  // Conjunto para armazenar os horários já reservados para a quadra e data escolhidas
  const horariosOcupados = new Set();

  if (snapshot.exists()) {
    snapshot.forEach((userSnapshot) => {
      userSnapshot.forEach((reservaSnapshot) => {
        const reserva = reservaSnapshot.val();
        if (reserva.quadra === quadra && reserva.data === data) {
          horariosOcupados.add(reserva.hora);
        }
      });
    });
  }

  // Resetar todos os horários (exceto o placeholder)
  for (let option of horarioSelect.options) {
    if (option.value !== "") {
      option.disabled = false;
      option.hidden = false;
    }
  }

  // Desabilitar horários ocupados
  let algumDisponivel = false;
  for (let option of horarioSelect.options) {
    if (horariosOcupados.has(option.value)) {
      option.disabled = true;
    } else if (option.value !== "") {
      algumDisponivel = true;
    }
  }

  // Mensagem se todos os horários estiverem ocupados
  erroReserva.textContent = algumDisponivel
    ? ""
    : "Todos os horários estão ocupados para esta data e quadra.";
}

// Atualiza os horários disponíveis ao carregar a página e a cada mudança na quadra ou data
document.addEventListener("DOMContentLoaded", atualizarHorariosDisponiveis);
quadraInput.addEventListener("change", atualizarHorariosDisponiveis);
dataInput.addEventListener("change", atualizarHorariosDisponiveis);
