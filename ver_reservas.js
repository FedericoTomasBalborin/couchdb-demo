const db = new PouchDB('reservas');
const remoteCouch = new PouchDB('http://admin:admin@127.0.0.1:5984/reservas');

let sincronizador = null

async function iniciar() {
    if (sincronizador) return;
    sincronizador = db.sync(remoteCouch, { live: true, retry: true }).on('change', mostrar_reservas);
}

async function detener() {
    if(!sincronizador) return;
    sincronizador.cancel();
    sincronizador = null;
}

async function cambiar_visto(reserva) {
    reserva.confirmada = !reserva.confirmada;
    await db.put(reserva);
    mostrar_reservas();
}

async function mostrar_reservas() {
    const tabla = document.querySelector('table tbody');
    tabla.innerHTML = '';

    const reservas = await db.allDocs({ include_docs: true, descending: true });
    reservas.rows.forEach(row => {
        const reserva = row.doc;
        const tr = document.createElement('tr');

        const nombre = document.createElement('td');
        const contacto = document.createElement('td');
        const destino = document.createElement('td');
        const fecha = document.createElement('td');
        const estado = document.createElement('td');
        
        nombre.textContent = reserva.usuario.nombre;
        contacto.textContent = reserva.usuario.email || reserva.usuario.telefono;
        destino.textContent = `${reserva.destino.ciudad}, ${reserva.destino.pais}`;
        fecha.textContent = new Date(reserva.fecha_viaje).toLocaleDateString();
        //El estado es un booleano que indica si la reserva está confirmada o pendiente, si clickeoo en el estado, cambia su valor
        estado.textContent = reserva.confirmada ? 'Confirmada' : 'Pendiente';
        estado.classList.add(reserva.confirmada ? 'confirmada' : 'pendiente');
        estado.addEventListener('click', async () => {
            cambiar_visto(reserva);
        });
        tr.appendChild(nombre);
        tr.appendChild(contacto);
        tr.appendChild(destino);
        tr.appendChild(fecha);
        tr.appendChild(estado);
        tabla.appendChild(tr);
    });
};
boton_offline = document.getElementById("boton-offline");
boton_offline.addEventListener("change", () => {
    if (boton_offline.checked) {
        detener()
    }
    else {
        iniciar()
    }
} );

iniciar()
mostrar_reservas()