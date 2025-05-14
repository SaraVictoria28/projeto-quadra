// js/minhas-reservas.js
import { auth, db } from "./firebase-config.js";
import {
  ref,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const reservarBtn = document.getElementById("btn-reservar");
const sairBtn = document.getElementById("sair");


document.addEventListener("DOMContentLoaded", () => {
  const listaReservasElement = document.getElementById("lista-reservas");

  auth.onAuthStateChanged((user) => {
    if (user) {
      const userId = user.uid;
      const reservasRef = ref(db, `reservas/${userId}`);

      onValue(
        reservasRef,
        (snapshot) => {
          if (snapshot.exists()) {
            listaReservasElement.innerHTML = "";

            snapshot.forEach((childSnapshot) => {
              const reservaId = childSnapshot.key;
              const reserva = childSnapshot.val();
              const horario = reserva.hora;
              const dia = reserva.data;
              const nomeAgendador = reserva.nome;

              const reservaItem = document.createElement("div");
              reservaItem.classList.add("reserva-item");

              const horarioElement = document.createElement("p");
              horarioElement.textContent = `Horário: ${horario}:00`;

              const diaElement = document.createElement("p");
              diaElement.textContent = `Dia: ${dia}`;

              const nomeElement = document.createElement("p");
              nomeElement.textContent = `Agendado por: ${nomeAgendador}`;

              const desmarcarButton = document.createElement("button");
              desmarcarButton.textContent = "Desmarcar";
              desmarcarButton.addEventListener("click", () =>
                desmarcarReserva(userId, reservaId)
              );

              reservaItem.appendChild(horarioElement);
              reservaItem.appendChild(diaElement);
              reservaItem.appendChild(nomeElement);
              reservaItem.appendChild(desmarcarButton);

              listaReservasElement.appendChild(reservaItem);
            });
          } else {
            listaReservasElement.textContent =
              "Você não possui nenhuma reserva.";
          }
        },
        (error) => {
          console.error("Erro ao buscar reservas:", error);
          listaReservasElement.textContent =
            "Ocorreu um erro ao carregar suas reservas.";
        }
      );
    } else {
      listaReservasElement.textContent =
        "Por favor, faça login para ver suas reservas.";
    }
  });
});

function desmarcarReserva(userId, reservaId) {
  const reservaRef = ref(db, `reservas/${userId}/${reservaId}`);
  remove(reservaRef)
    .then(() => {
      console.log(`Reserva com ID ${reservaId} desmarcada com sucesso.`);
      // A lista de reservas será atualizada automaticamente devido ao 'onValue'
    })
    .catch((error) => {
      console.error("Erro ao desmarcar reserva:", error);
      alert("Ocorreu um erro ao tentar desmarcar a reserva.");
    });
}

reservarBtn.addEventListener('click', ()=> {
  window.location.href = "home.html";
});

sairBtn.addEventListener('click', ()=> {
  window.location.href = "index.html";
});