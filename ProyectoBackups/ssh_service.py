# ssh_service.py

import paramiko
import os

class SSHService:
    def __init__(self, ip, usuario, password):
        self.ip = ip
        self.usuario = usuario
        self.password = password
        self.cliente = None
        self.sftp = None

    def conectar(self):
        try:
            self.cliente = paramiko.SSHClient()
            self.cliente.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            self.cliente.connect(hostname=self.ip, username=self.usuario, password=self.password, timeout=10)
            self.sftp = self.cliente.open_sftp()
            return True
        except Exception as e:
            print(f"[ERROR] No se pudo conectar a {self.ip}: {e}")
            return False

    def ejecutar_comando(self, comando):
        if self.cliente is None:
            raise Exception("No hay conexión SSH activa.")
        try:
            stdin, stdout, stderr = self.cliente.exec_command(comando)
            salida = stdout.read().decode()
            errores = stderr.read().decode()
            return salida, errores
        except Exception as e:
            print(f"[ERROR] Al ejecutar comando: {e}")
            return "", str(e)

    def descargar_respaldo(self, remote_path, local_dir):
        """
        Descarga un archivo individual desde remote_path (ruta absoluta en el dispositivo)
        y lo guarda dentro de local_dir (carpeta local).
        Crea local_dir si no existe. Devuelve la ruta local del archivo descargado.
        """
        if self.sftp is None:
            raise Exception("No hay conexión SFTP activa.")

        os.makedirs(local_dir, exist_ok=True)
        filename = os.path.basename(remote_path)
        local_path = os.path.join(local_dir, filename)

        try:
            self.sftp.get(remote_path, local_path)
            return local_path
        except Exception as e:
            print(f"[ERROR] Al descargar {remote_path}: {e}")
            return None

    def eliminar_respaldos_antiguos(self, remote_dir, dias=180):
        """
        Elimina, dentro de remote_dir en el dispositivo, todos los archivos
        con más de 'dias' días de antigüedad. Utiliza un comando remoto 'find'.
        """
        if self.cliente is None:
            raise Exception("No hay conexión SSH activa.")

        comando = f"find {remote_dir} -type f -mtime +{dias} -exec rm -f {{}} \\;"
        try:
            stdin, stdout, stderr = self.cliente.exec_command(comando)
            stderr_data = stderr.read().decode()
            if stderr_data:
                print(f"[WARNING] Errores al limpiar respaldos antiguos: {stderr_data}")
            return True
        except Exception as e:
            print(f"[ERROR] Al ejecutar limpieza de respaldos: {e}")
            return False

    def cerrar(self):
        if self.sftp:
            self.sftp.close()
        if self.cliente:
            self.cliente.close()
