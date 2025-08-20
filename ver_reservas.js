const db = new PouchDB('reservas');
const remoteCouch = new PouchDB('http://admin:password@127.0.0.1:5984/reservas');

db.sync(remoteCouch, { live: true, retry: true }).on('change', mostrar_reservas);

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
        
        nombre.textContent = reserva.usuario.nombre;
        contacto.textContent = reserva.usuario.email || reserva.usuario.telefono;
        destino.textContent = `${reserva.destino.ciudad}, ${reserva.destino.pais}`;
        fecha.textContent = new Date(reserva.fecha_viaje).toLocaleDateString();
        tr.appendChild(nombre);
        tr.appendChild(contacto);
        tr.appendChild(destino);
        tr.appendChild(fecha);
        tabla.appendChild(tr);
    });
};

mostrar_reservas();