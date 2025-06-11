import paramiko

class SSHService:
    def __init__(self, ip, usuario, password):
        self.ip = ip.strip()
        self.usuario = usuario.strip()
        self.password = password.strip()
        self.cliente = None

    def conectar(self):
        try:
            self.cliente = paramiko.SSHClient()
            self.cliente.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            self.cliente.connect(hostname=self.ip, username=self.usuario, password=self.password, timeout=10)
            return True
        except Exception as e:
            print(f"[ERROR SSH] {e}")
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
            return "", str(e)

    def cerrar(self):
        if self.cliente:
            self.cliente.close()
