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
    conn.execute("INSERT INTO dispositivos (nombre, ip, usuario, password) VALUES (?, ?, ?, ?)",
                 (data['nombre'], data['ip'], data['usuario'], data['password']))
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
        salida, errores = ssh.ejecutar_comando("echo SSH OK")
        ssh.cerrar()
        return jsonify({"salida": salida, "errores": errores})
    else:
        return jsonify({"error": "No se pudo conectar al dispositivo"}), 400

@app.route("/backup", methods=["POST"])
def hacer_backup():
    data = request.get_json()
    ssh = SSHService(data['ip'], data['usuario'], data['password'])
    if ssh.conectar():
        comando = "echo backup realizado correctamente"
        salida, errores = ssh.ejecutar_comando(comando)
        ssh.cerrar()
        return jsonify({"salida": salida, "errores": errores})
    else:
        return jsonify({"error": "No se pudo conectar al dispositivo"}), 400

if __name__ == "__main__":
    app.run(debug=True)
