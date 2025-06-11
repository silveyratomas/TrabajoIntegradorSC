// Lista simulada de dispositivos (por ahora en memoria)
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
document.getElementById('btn-probar').addEventListener('click', () => {
  alert('Simulación: probando conexión SSH...');
});

// Agrega un nuevo dispositivo a la lista
function agregarDispositivo() {
  const nuevo = {
    id: Date.now(),
    nombre: nombreInput.value,
    ip: ipInput.value,
    usuario: usuarioInput.value
  };
  if (nuevo.nombre && nuevo.ip && nuevo.usuario && passwordInput.value) {
    dispositivos.push(nuevo);
    limpiarCampos();
    renderizarTabla();
  } else {
    alert('Todos los campos son obligatorios');
  }
}

// Carga los datos del dispositivo seleccionado en los inputs
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
    // Nota: la contraseña no la guardamos en esta demo
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

document.getElementById('btn-backup').addEventListener('click', () => {
  if (!dispositivoSeleccionado) {
    alert('Seleccioná un dispositivo primero');
    return;
  }
  const dispositivo = dispositivos.find(d => d.id === dispositivoSeleccionado);
  if (dispositivo) {
    alert(`Simulación: Iniciando backup para ${dispositivo.ip}`);
    // Acá en el futuro se va a hacer la llamada real al backend
  }
});