// db local en el navegador
const db = new PouchDB('peliculas');

// CouchDB remoto, en la parte donde dice admin:password va el usuario y contraseña que creaste cuando instalaste couchDB
//Aca solo funciona en la misma maquina, para acceder desde otra maquina hay que cambiar el 127.0.0.1 por la ip de la maquina donde esta couchDB
const remoteDB = new PouchDB('http://admin:admin@127.0.0.1:5984/peliculas');

// Sincronizacion continua
const dbSync = db.sync(remoteDB, { live: true, retry: true })
  .on('change', renderPeliculas)
  .on('error', console.error);

// Para detener la sincronización, puedes usar:

async function agregar_pelicula() {
  const input = document.getElementById('peliculaInput');
  const taskText = input.value.trim();
  if (!taskText) return;

  await db.post({
    nombre: taskText,
    fue_visto: false,
    para_borrar: false,
    creada: new Date().toISOString()
  });

  input.value = '';
  renderPeliculas();
}

async function cambiar_visto(pelicula) {
  pelicula.fue_visto = !pelicula.fue_visto;
  await db.put(pelicula);
  renderPeliculas();
}

async function eliminar_pelicula(pelicula) {
  pelicula.para_borrar = !pelicula.para_borrar;
  await db.put(pelicula);
  renderPeliculas();
}

async function eliminar_peliculas() {
  const result = await db.allDocs({ include_docs: true, descending: true });
  const docsToDelete = result.rows
    .filter(row => row.doc.para_borrar)
    .map(row => ({ _id: row.doc._id, _rev: row.doc._rev, _deleted: true }));

  if (docsToDelete.length > 0) {
    await db.bulkDocs(docsToDelete);
    renderPeliculas();
  }
}

async function renderPeliculas() {
  const list = document.getElementById('listaPeliculas');
  list.innerHTML = '';

  const result = await db.allDocs({ include_docs: true, descending: true });
  result.rows.forEach(row => {
    const pelicula = row.doc;
    const li = document.createElement('li');
    li.textContent = pelicula.nombre;
    if (pelicula.fue_visto) li.classList.add('fue_visto');
    if (pelicula.para_borrar) li.classList.add('para_borrar');

    const borrBtn = document.createElement('img');
    borrBtn.src = 'borrar.png';
    borrBtn.onclick = () => eliminar_pelicula(pelicula);

    const verBtn = document.createElement('img');
    if (pelicula.fue_visto) {
        verBtn.src = 'visto.png';
    }
    else {
        verBtn.src = 'novisto.png';
    }
    verBtn.onclick = () => cambiar_visto(pelicula);

    li.appendChild(verBtn);
    li.appendChild(borrBtn);
    list.appendChild(li);
  });
}

document.getElementById('agrBtn').addEventListener('click', agregar_pelicula);
document.getElementById('borrarPeliculas').addEventListener('click', eliminar_peliculas);
renderPeliculas();














//dbSync.cancel()





