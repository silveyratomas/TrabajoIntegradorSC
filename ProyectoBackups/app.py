# app.py

from flask import Flask, request, jsonify, send_from_directory, render_template
import sqlite3
import os
from datetime import datetime
from ssh_service import SSHService

app = Flask(__name__, static_folder="static", template_folder="templates")
DB_PATH = 'dispositivos.db'

# ------------------------------------------------------------------
# 1) Función de ayuda para conectarse a la base SQLite
# ------------------------------------------------------------------
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ------------------------------------------------------------------
# 2) Al arrancar, creamos la tabla si no existe
# ------------------------------------------------------------------
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS dispositivos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            ip TEXT NOT NULL,
            usuario TEXT NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# ------------------------------------------------------------------
# 3) Ruta principal: sirve index.html
# ------------------------------------------------------------------
@app.route('/')
def index():
    return render_template('index.html')

# ------------------------------------------------------------------
# 3.1) Ruta de prueba: /ping
# ------------------------------------------------------------------
@app.route('/ping')
def ping():
    return 'pong'

# ------------------------------------------------------------------
# 4) API: Listar todos los dispositivos
# ------------------------------------------------------------------
@app.route('/api/devices', methods=['GET'])
def listar_dispositivos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre, ip, usuario FROM dispositivos")
    rows = cursor.fetchall()
    conn.close()
    dispositivos = []
    for row in rows:
        dispositivos.append({
            'id': row['id'],
            'nombre': row['nombre'],
            'ip': row['ip'],
            'usuario': row['usuario']
        })
    return jsonify(dispositivos)

# ------------------------------------------------------------------
# 5) API: Agregar un dispositivo
# ------------------------------------------------------------------
@app.route('/api/devices', methods=['POST'])
def agregar_dispositivo():
    data = request.get_json()
    nombre = data.get('nombre')
    ip = data.get('ip')
    usuario = data.get('usuario')
    password = data.get('password')

    if not all([nombre, ip, usuario, password]):
        return jsonify({'error': 'Faltan datos obligatorios.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO dispositivos (nombre, ip, usuario, password) VALUES (?, ?, ?, ?)",
        (nombre, ip, usuario, password)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return jsonify({
        'id': new_id,
        'nombre': nombre,
        'ip': ip,
        'usuario': usuario
    }), 201

# ------------------------------------------------------------------
# 6) API: Obtener un dispositivo por ID
# ------------------------------------------------------------------
@app.route('/api/devices/<int:device_id>', methods=['GET'])
def obtener_dispositivo(device_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM dispositivos WHERE id = ?", (device_id,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        return jsonify({'error': 'Dispositivo no encontrado'}), 404

    dispositivo = {
        'id': row['id'],
        'nombre': row['nombre'],
        'ip': row['ip'],
        'usuario': row['usuario'],
    }
    return jsonify(dispositivo)

# ------------------------------------------------------------------
# 7) API: Actualizar un dispositivo
# ------------------------------------------------------------------
@app.route('/api/devices/<int:device_id>', methods=['PUT'])
def actualizar_dispositivo(device_id):
    data = request.get_json()
    nombre = data.get('nombre')
    ip = data.get('ip')
    usuario = data.get('usuario')
    password = data.get('password')

    if not all([nombre, ip, usuario, password]):
        return jsonify({'error': 'Faltan datos obligatorios.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE dispositivos SET nombre = ?, ip = ?, usuario = ?, password = ? WHERE id = ?",
        (nombre, ip, usuario, password, device_id)
    )
    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Dispositivo no encontrado'}), 404

    conn.close()
    return jsonify({
        'id': device_id,
        'nombre': nombre,
        'ip': ip,
        'usuario': usuario
    })

# ------------------------------------------------------------------
# 8) API: Eliminar un dispositivo
# ------------------------------------------------------------------
@app.route('/api/devices/<int:device_id>', methods=['DELETE'])
def eliminar_dispositivo_api(device_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM dispositivos WHERE id = ?", (device_id,))
    conn.commit()
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Dispositivo no encontrado'}), 404
    conn.close()
    return '', 204

# ------------------------------------------------------------------
# 9) API: Probar conexión SSH
# ------------------------------------------------------------------
@app.route('/api/devices/<int:device_id>/test_ssh', methods=['POST'])
def test_ssh(device_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT ip, usuario, password FROM dispositivos WHERE id = ?", (device_id,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        return jsonify({'success': False, 'error': 'Dispositivo no encontrado'}), 404

    ip, usuario, password = row['ip'], row['usuario'], row['password']
    ssh = SSHService(ip, usuario, password)
    if not ssh.conectar():
        return jsonify({'success': False, 'error': 'No se pudo conectar por SSH'}), 200

    salida, errores = ssh.ejecutar_comando('echo prueba')
    ssh.cerrar()
    if errores:
        return jsonify({'success': False, 'error': errores}), 200
    else:
        return jsonify({'success': True, 'output': salida}), 200

# ------------------------------------------------------------------
# 10) API: Generar backup y descargarlo
# ------------------------------------------------------------------
@app.route('/api/devices/<int:device_id>/backup', methods=['POST'])
def backup_device(device_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT nombre, ip, usuario, password FROM dispositivos WHERE id = ?", (device_id,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        return jsonify({'success': False, 'error': 'Dispositivo no encontrado'}), 404

    nombre, ip, usuario, password = row['nombre'], row['ip'], row['usuario'], row['password']

    ssh = SSHService(ip, usuario, password)
    if not ssh.conectar():
        return jsonify({'success': False, 'error': 'No se pudo conectar por SSH'}), 200

    ahora = datetime.now().strftime("%Y%m%d_%H%M%S")
    nombre_archivo = f"{nombre}_backup_{ahora}"
    comando = f"/export file={nombre_archivo}"
    remote_path = f"/file/{nombre_archivo}.rsc"

    salida, error = ssh.ejecutar_comando(comando)
    if error:
        ssh.cerrar()
        return jsonify({'success': False, 'error': error}), 200

    carpeta_local = os.path.join("backups", nombre)
    local_path = ssh.descargar_respaldo(remote_path, carpeta_local)
    ssh.cerrar()

    if local_path is None:
        return jsonify({'success': False, 'error': 'Error al descargar el archivo'}), 200

    return jsonify({'success': True, 'local_path': local_path}), 200

# ------------------------------------------------------------------
# 11) Servir archivos estáticos
# ------------------------------------------------------------------
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

# ------------------------------------------------------------------
# 12) Iniciar la aplicación
# ------------------------------------------------------------------
if __name__ == '__main__':
    os.makedirs("backups", exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
