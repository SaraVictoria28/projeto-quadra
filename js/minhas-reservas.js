import { auth, db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const listaReservasElement = document.getElementById('lista-reservas');

    auth.onAuthStateChanged(user => {
        if (user) {
            const userId = user.uid;
            const reservasRef = ref(db, `reservas/${userId}`);

            onValue(reservasRef, (snapshot) => {
                if (snapshot.exists()) {
                    listaReservasElement.innerHTML = '';

                    snapshot.forEach(childSnapshot => {
                        const reserva = childSnapshot.val();
                        const horario = reserva.hora;
                        const dia = reserva.data;
                        const nomeAgendador = reserva.nome;

                        const reservaItem = document.createElement('div');
                        reservaItem.classList.add('reserva-item');

                        const horarioElement = document.createElement('p');
                        horarioElement.textContent = `Horário: ${horario}:00`; // Assumindo que a hora está salva sem os minutos

                        const diaElement = document.createElement('p');
                        diaElement.textContent = `Dia: ${dia}`;

                        const nomeElement = document.createElement('p');
                        nomeElement.textContent = `Agendado por: ${nomeAgendador}`;

                        reservaItem.appendChild(horarioElement);
                        reservaItem.appendChild(diaElement);
                        reservaItem.appendChild(nomeElement);

                        listaReservasElement.appendChild(reservaItem);
                    });
                } else {
                    listaReservasElement.textContent = 'Você não possui nenhuma reserva.';
                }
            }, (error) => {
                console.error("Erro ao buscar reservas:", error);
                listaReservasElement.textContent = 'Ocorreu um erro ao carregar suas reservas.';
            });
        } else {
            listaReservasElement.textContent = 'Por favor, faça login para ver suas reservas.';
        }
    });
});