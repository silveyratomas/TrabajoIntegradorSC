// Lista simulada de dispositivos (por ahora en memoria)
let dispositivos = [];
let dispositivoSeleccionado = null;

// Referencias a los campos
const nombreInput = document.getElementById('nombre');
const ipInput = document.getElementById('ip');
const usuarioInput = document.getElementById('usuario');
const passwordInput = document.getElementById('password');
const tipoInput = document.getElementById('tipo');
const puertoInput = document.getElementById('puerto_ssh');
const tabla = document.getElementById('tabla-dispositivos');


// Botones
document.getElementById('btn-agregar').addEventListener('click', agregarDispositivo);
document.getElementById('btn-eliminar').addEventListener('click', eliminarDispositivo);
document.getElementById('btn-cargar').addEventListener('click', cargarDispositivo);
document.getElementById('btn-modificar').addEventListener('click', modificarDispositivo);
document.getElementById('btn-backup').addEventListener('click', hacerBackup);
document.getElementById('btn-probar').addEventListener('click', () => {
  if (!dispositivoSeleccionado) {
    alert('Seleccioná un dispositivo primero');
    return;
  }

  const dispositivo = dispositivos.find(d => d.id === dispositivoSeleccionado);
  if (!dispositivo) {
    alert('Dispositivo no encontrado');
    return;
  }

  const data = {
    ip: dispositivo.ip,
    usuario: dispositivo.usuario,
    password: dispositivo.password
  };

  fetch('/probar_ssh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(respuesta => {
    if (respuesta.salida) {
      alert("✅ Conexión SSH exitosa:\n" + respuesta.salida);
    } else {
      alert("❌ Error:\n" + respuesta.error);
    }
  })
  .catch(err => {
    alert("❌ Error de red o del servidor:\n" + err);
  });
});


function agregarDispositivo() {
  const nuevo = {
    id: Date.now(),
    nombre: nombreInput.value,
    ip: ipInput.value,
    usuario: usuarioInput.value,
    password: passwordInput.value,
    tipo: tipoInput.value, // ← este es el nuevo campo
    puerto_ssh: parseInt(puertoInput.value) || 22  // ← por si no lo completan

  };

  if (nuevo.nombre && nuevo.ip && nuevo.usuario && nuevo.password) {
    dispositivos.push(nuevo);
    limpiarCampos();
    renderizarTabla();
  } else {
    alert('Todos los campos son obligatorios');
  }
}


function cargarDispositivo() {
  if (!dispositivoSeleccionado) {
    alert('Seleccioná una fila primero');
    return;
  }
  const dispositivo = dispositivos.find(d => d.id === dispositivoSeleccionado);
  if (dispositivo) {
    nombreInput.value = dispositivo.nombre;
    ipInput.value = dispositivo.ip;
    usuarioInput.value = dispositivo.usuario;
    tipoInput.value = dispositivo.tipo || '';  // ← Esto es lo nuevo
    puertoInput.value = dispositivo.puerto_ssh || 22;
    // Nota: la contraseña no la mostramos por seguridad
  }
}


// Modifica el dispositivo actualmente cargado
function modificarDispositivo() {
  if (!dispositivoSeleccionado) {
    alert('Seleccioná una fila primero');
    return;
  }
  const index = dispositivos.findIndex(d => d.id === dispositivoSeleccionado);
  if (index !== -1) {
    dispositivos[index].nombre = nombreInput.value;
    dispositivos[index].ip = ipInput.value;
    dispositivos[index].usuario = usuarioInput.value;
    renderizarTabla();
    limpiarCampos();
  }
}

// Elimina el dispositivo seleccionado
function eliminarDispositivo() {
  if (!dispositivoSeleccionado) {
    alert('Seleccioná una fila primero');
    return;
  }
  dispositivos = dispositivos.filter(d => d.id !== dispositivoSeleccionado);
  renderizarTabla();
  limpiarCampos();
}

// Muestra todos los dispositivos en la tabla
function renderizarTabla() {
  tabla.innerHTML = '';
  dispositivos.forEach(d => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${d.id}</td>
      <td>${d.nombre}</td>
      <td>${d.ip}</td>
      <td>${d.usuario}</td>
      <td>${d.tipo || ''}</td>
      <td>${d.puerto_ssh || ''}</td>
    `;
    fila.addEventListener('click', () => {
      dispositivoSeleccionado = d.id;
      document.querySelectorAll('tr').forEach(f => f.classList.remove('seleccionado'));
      fila.classList.add('seleccionado');
    });
    tabla.appendChild(fila);
  });
}

function limpiarCampos() {
  nombreInput.value = '';
  ipInput.value = '';
  usuarioInput.value = '';
  passwordInput.value = '';
  tipoInput.value = '';
  puertoInput.value = '';
  dispositivoSeleccionado = null;
}

document.getElementById('btn-probar').addEventListener('click', () => {
  if (!dispositivoSeleccionado) {
    alert("Seleccioná un dispositivo primero");
    return;
  }

  const dispositivo = dispositivos.find(d => d.id === dispositivoSeleccionado);
  fetch("/probar_ssh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ip: dispositivo.ip,
      usuario: dispositivo.usuario,
      password: dispositivo.password
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.salida) {
      alert("✅ Conexión exitosa:\n" + data.salida);
    } else {
      alert("❌ Error: " + (data.error || data.errores));
    }
  });
});


async function hacerBackup() {
  if (!dispositivoSeleccionado) {
    alert("Seleccioná un dispositivo primero");
    return;
  }

  const dispositivo = dispositivos.find(d => d.id === dispositivoSeleccionado);
  if (!dispositivo) return;

  const res = await fetch("/backup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ip: dispositivo.ip,
      usuario: dispositivo.usuario,
      password: dispositivo.password
    })
  });

  const respuesta = await res.json();

  if (res.ok) {
    alert("Backup realizado:\n" + respuesta.salida);
  } else {
    alert("Error:\n" + (respuesta.error || "Error desconocido"));
  }
}


