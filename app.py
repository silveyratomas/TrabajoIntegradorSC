from flask import Flask, render_template, request, jsonify
import sqlite3
from ssh_service import SSHService

app = Flask(__name__)

DB_PATH = 'dispositivos.db'

def conectar_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/dispositivos", methods=["GET"])
def listar_dispositivos():
    conn = conectar_db()
    dispositivos = conn.execute("SELECT * FROM dispositivos").fetchall()
    conn.close()
    return jsonify([dict(row) for row in dispositivos])

@app.route("/agregar", methods=["POST"])
def agregar_dispositivo():
    data = request.get_json()
    conn = conectar_db()
    conn.execute("""
        INSERT INTO dispositivos (nombre, ip, usuario, password, tipo, puerto_ssh)
        VALUES (?, ?, ?, ?, ?)
    """, (
        data['nombre'],
        data['ip'],
        data['usuario'],
        data['password'],
        data['tipo'],
        data['puerto_ssh']
    ))
    conn.commit()
    conn.close()
    return jsonify({"mensaje": "Dispositivo agregado"})


@app.route("/eliminar", methods=["POST"])
def eliminar_dispositivo():
    data = request.get_json()
    conn = conectar_db()
    conn.execute("DELETE FROM dispositivos WHERE id=?", (data['id'],))
    conn.commit()
    conn.close()
    return jsonify({"mensaje": "Dispositivo eliminado"})

@app.route("/probar_ssh", methods=["POST"])
def probar_ssh():
    data = request.get_json()
    ssh = SSHService(data['ip'], data['usuario'], data['password'])
    if ssh.conectar():
        salida, errores = ssh.ejecutar_comando("/ip address print")
        ssh.cerrar()
        return jsonify({"salida": salida, "errores": errores})
    else:
        return jsonify({"error": "No se pudo conectar al dispositivo"}), 400

@app.route("/backup", methods=["POST"])
def hacer_backup():
    import os
    from datetime import datetime

    data = request.get_json()
    ssh = SSHService(data['ip'], data['usuario'], data['password'])

    if ssh.conectar():
        # 1. Generar nombre base del archivo SIN .backup
        nombre_base = f"backup_{data['ip'].replace('.', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        nombre_remoto = f"{nombre_base}.backup"  # Mikrotik le agrega esto automáticamente
        ruta_local = os.path.join("backups", nombre_remoto)

        # 2. Crear el backup en el router
        comando = f"/system backup save name={nombre_base}"
        ssh.ejecutar_comando(comando)

        # 3. Descargar el archivo
        try:
            ssh.descargar_archivo(nombre_remoto, ruta_local)
        except Exception as e:
            ssh.cerrar()
            return jsonify({"error": f"Backup creado pero no se pudo descargar: {str(e)}"}), 500

        ssh.cerrar()
        return jsonify({"salida": f"Backup guardado localmente en {ruta_local}"})

    else:
        return jsonify({"error": "No se pudo conectar al dispositivo"}), 400




    
if __name__ == "__main__":
    app.run(debug=True)
