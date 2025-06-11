// static/script.js

let dispositivos = [];
let dispositivoSeleccionado = null;

// Referencias a los campos
const nombreInput = document.getElementById('nombre');
const ipInput = document.getElementById('ip');
const usuarioInput = document.getElementById('usuario');
const passwordInput = document.getElementById('password');
const tabla = document.getElementById('tabla-dispositivos');

// Botones
document.getElementById('btn-agregar').addEventListener('click', agregarDispositivo);
document.getElementById('btn-eliminar').addEventListener('click', eliminarDispositivo);
document.getElementById('btn-cargar').addEventListener('click', cargarDispositivo);
document.getElementById('btn-modificar').addEventListener('click', modificarDispositivo);
document.getElementById('btn-probar').addEventListener('click', probarSSH);
document.getElementById('btn-backup').addEventListener('click', hacerBackup);

// Al cargar la página, obtenemos la lista real desde el backend
window.addEventListener('load', () => {
  fetch('/api/devices')
    .then(res => res.json())
    .then(data => {
      dispositivos = data;
      renderizarTabla();
    })
    .catch(err => console.error("Error al cargar dispositivos:", err));
});

// Agrega un nuevo dispositivo a la base (backend)
function agregarDispositivo() {
  const nuevo = {
    nombre: nombreInput.value,
    ip: ipInput.value,
    usuario: usuarioInput.value,
    password: passwordInput.value
  };
  if (!nuevo.nombre || !nuevo.ip || !nuevo.usuario || !nuevo.password) {
    alert('Todos los campos son obligatorios');
    return;
  }
  fetch('/api/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevo)
  })
  .then(res => res.json())
  .then(data => {
    dispositivos.push(data);
    renderizarTabla();
    limpiarCampos();
  })
  .catch(err => console.error("Error al agregar dispositivo:", err));
}

// Carga los datos del dispositivo seleccionado en los inputs
function cargarDispositivo() {
  if (!dispositivoSeleccionado) {
    alert('Seleccioná una fila primero');
    return;
  }
  fetch(`/api/devices/${dispositivoSeleccionado}`)
    .then(res => res.json())
    .then(d => {
      nombreInput.value = d.nombre;
      ipInput.value = d.ip;
      usuarioInput.value = d.usuario;
      // Nota: no mostramos la contraseña, por seguridad
    })
    .catch(err => console.error("Error al cargar dispositivo:", err));
}

// Modifica el dispositivo actualmente cargado
function modificarDispositivo() {
  if (!dispositivoSeleccionado) {
    alert('Seleccioná una fila primero');
    return;
  }
  const upd = {
    nombre: nombreInput.value,
    ip: ipInput.value,
    usuario: usuarioInput.value,
    password: passwordInput.value
  };
  if (!upd.nombre || !upd.ip || !upd.usuario || !upd.password) {
    alert('Todos los campos son obligatorios');
    return;
  }
  fetch(`/api/devices/${dispositivoSeleccionado}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(upd)
  })
  .then(res => res.json())
  .then(actualizado => {
    const idx = dispositivos.findIndex(d => d.id === dispositivoSeleccionado);
    if (idx !== -1) {
      dispositivos[idx] = actualizado;
      renderizarTabla();
    }
    limpiarCampos();
  })
  .catch(err => console.error("Error al modificar dispositivo:", err));
}

// Elimina el dispositivo seleccionado
function eliminarDispositivo() {
  if (!dispositivoSeleccionado) {
    alert('Seleccioná una fila primero');
    return;
  }
  fetch(`/api/devices/${dispositivoSeleccionado}`, {
    method: 'DELETE'
  })
  .then(res => {
    if (res.ok) {
      dispositivos = dispositivos.filter(d => d.id !== dispositivoSeleccionado);
      renderizarTabla();
      limpiarCampos();
    } else {
      alert("No se pudo eliminar el dispositivo.");
    }
  })
  .catch(err => console.error("Error al eliminar dispositivo:", err));
}

// Prueba la conexión SSH
function probarSSH() {
  if (!dispositivoSeleccionado) {
    alert('Seleccioná un dispositivo primero');
    return;
  }
  fetch(`/api/devices/${dispositivoSeleccionado}/test_ssh`, {
    method: 'POST'
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`SSH OK:\nSalida:\n${data.output}`);
    } else {
      alert(`Error SSH:\n${data.error}`);
    }
  })
  .catch(err => console.error("Error al probar SSH:", err));
}

// Dispara un backup real
function hacerBackup() {
  if (!dispositivoSeleccionado) {
    alert('Seleccioná un dispositivo primero');
    return;
  }
  fetch(`/api/devices/${dispositivoSeleccionado}/backup`, {
    method: 'POST'
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`Backup completado:\nArchivo guardado en:\n${data.local_path}`);
    } else {
      alert(`Error en backup:\n${data.error}`);
    }
  })
  .catch(err => console.error("Error al hacer backup:", err));
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
  dispositivoSeleccionado = null;
}
