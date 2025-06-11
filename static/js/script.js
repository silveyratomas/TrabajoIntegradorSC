const nombreInput = document.getElementById('nombre');
const ipInput = document.getElementById('ip');
const usuarioInput = document.getElementById('usuario');
const passwordInput = document.getElementById('password');
const tabla = document.getElementById('tabla-dispositivos');

let dispositivoSeleccionado = null;

document.getElementById('btn-agregar').addEventListener('click', agregarDispositivo);
document.getElementById('btn-eliminar').addEventListener('click', eliminarDispositivo);
document.getElementById('btn-cargar').addEventListener('click', cargarDispositivo);
document.getElementById('btn-modificar').addEventListener('click', modificarDispositivo);
document.getElementById('btn-probar').addEventListener('click', probarSSH);
document.getElementById('btn-backup').addEventListener('click', hacerBackup);

function limpiarCampos() {
  nombreInput.value = '';
  ipInput.value = '';
  usuarioInput.value = '';
  passwordInput.value = '';
  dispositivoSeleccionado = null;
}

async function renderizarTabla() {
  const res = await fetch("/dispositivos");
  const dispositivos = await res.json();
  tabla.innerHTML = "";
  dispositivos.forEach(d => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td>${d.id}</td><td>${d.nombre}</td><td>${d.ip}</td><td>${d.usuario}</td>`;
    fila.addEventListener("click", () => {
      dispositivoSeleccionado = d;
      nombreInput.value = d.nombre;
      ipInput.value = d.ip;
      usuarioInput.value = d.usuario;
    });
    tabla.appendChild(fila);
  });
}

async function agregarDispositivo() {
  const data = {
    nombre: nombreInput.value,
    ip: ipInput.value,
    usuario: usuarioInput.value,
    password: passwordInput.value
  };
  const res = await fetch("/agregar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (res.ok) {
    alert("Dispositivo agregado");
    limpiarCampos();
    renderizarTabla();
  } else {
    alert("Error al agregar");
  }
}

async function eliminarDispositivo() {
  if (!dispositivoSeleccionado) {
    alert("Seleccioná una fila primero");
    return;
  }
  const res = await fetch("/eliminar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: dispositivoSeleccionado.id })
  });
  if (res.ok) {
    alert("Dispositivo eliminado");
    limpiarCampos();
    renderizarTabla();
  } else {
    alert("Error al eliminar");
  }
}

function cargarDispositivo() {
  if (!dispositivoSeleccionado) {
    alert("Seleccioná una fila primero");
    return;
  }
  nombreInput.value = dispositivoSeleccionado.nombre;
  ipInput.value = dispositivoSeleccionado.ip;
  usuarioInput.value = dispositivoSeleccionado.usuario;
}

function modificarDispositivo() {
  alert("Función no implementada todavía");
}

async function probarSSH() {
  const data = {
    ip: ipInput.value,
    usuario: usuarioInput.value,
    password: passwordInput.value
  };
  const res = await fetch("/probar_ssh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const respuesta = await res.json();
  if (res.ok) {
    alert("Respuesta SSH:\n" + respuesta.salida);
  } else {
    alert("Error: " + respuesta.error);
  }
}

async function hacerBackup() {
  const data = {
    ip: ipInput.value,
    usuario: usuarioInput.value,
    password: passwordInput.value
  };

  const res = await fetch("/backup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const respuesta = await res.json();
  if (res.ok) {
    alert("Backup ejecutado:\n" + respuesta.salida);
  } else {
    alert("Error:\n" + respuesta.error);
  }
}

window.onload = renderizarTabla;
