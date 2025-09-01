//Esta pagina sirve para agregar reservas a la base de datos
//Es un formulario simple
const localdb = new PouchDB('reservas');
const remoteCouch = new PouchDB('http://admin:admin@127.0.0.1:5984/reservas');

const dbsync = localdb.sync(remoteCouch, {
    live: true, retry: true
})

async function agregar_reserva() {
  const usuarioNombre = document.getElementById('nombre');
  const usuarioEmail = document.getElementById('email');
  const usuarioTel = document.getElementById('telefono');
  const destinoCiudad = document.getElementById('ciudad');
  const destinoPais = document.getElementById('pais');
  const fecha = document.getElementById('fecha');

  const usuario = { nombre: usuarioNombre.value };
  if (usuarioEmail.value) usuario.email = usuarioEmail.value;
  if (usuarioTel.value) usuario.telefono = usuarioTel.value;

  const destino = { ciudad: destinoCiudad.value, pais: destinoPais.value };



  await localdb.post({
    "_id": "reserva_" + new Date().toISOString(),
    "tipo": "reserva",
    "usuario": usuario,
    "destino": destino,
    "fecha_viaje": fecha.value
  })

  usuarioNombre.value = '';
  usuarioEmail.value = '';
  usuarioTel.value = '';
  destinoCiudad.value = '';
  destinoPais.value = '';
  fecha.value = '';
}

document.querySelector('form').addEventListener('submit', async (event)=> 
  {
    event.preventDefault()
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');

    if (!email.value && !telefono.value) {
    alert("Debe ingresar al menos un contacto: email o teléfono.");
    return;
  }
    agregar_reserva();
  });


dbsync.cancel()