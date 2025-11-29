import socket
import threading
import sys
from colorama import init, Fore, Style

# Inicializa cores para Windows
init(autoreset=True)

class ChatClient:
    def __init__(self):
        self.nickname = input(f"{Fore.CYAN}Escolha seu apelido: {Style.RESET_ALL}")
        self.client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.host = '127.0.0.1' # IP do servidor (localhost)
        self.port = 55555       # Mesma porta do servidor
        self.running = True

    def connect(self):
        try:
            # O Cliente usa CONNECT, não bind
            self.client.connect((self.host, self.port))
        except ConnectionRefusedError:
            print(f"{Fore.RED}❌ Erro: Não foi possível conectar. Verifique se 'servidor.py' está rodando.{Style.RESET_ALL}")
            sys.exit()

        # Inicia threads para escutar e falar ao mesmo tempo
        receive_thread = threading.Thread(target=self.receive)
        receive_thread.start()

        write_thread = threading.Thread(target=self.write)
        write_thread.start()

    def receive(self):
        """Escuta mensagens do servidor."""
        while self.running:
            try:
                message = self.client.recv(1024).decode('utf-8')
                
                if message == 'NICK':
                    self.client.send(self.nickname.encode('utf-8'))
                else:
                    if "🤖" in message:
                        print(f"{Fore.MAGENTA}{message}{Style.RESET_ALL}")
                    elif "⚠️" in message or "✨" in message:
                        print(f"{Fore.YELLOW}{message}{Style.RESET_ALL}")
                    else:
                        print(f"{Fore.WHITE}{message}{Style.RESET_ALL}")

            except OSError:
                break
            except Exception:
                self.client.close()
                break

    def write(self):
        """Envia mensagens."""
        while self.running:
            try:
                text = input("")
                if text.lower() == '/sair':
                    self.running = False
                    self.client.close()
                    sys.exit()
                
                message = f'{self.nickname}: {text}'
                self.client.send(message.encode('utf-8'))
            except:
                break

if __name__ == "__main__":
    print(f"{Fore.BLUE}--- CHAT CLIENTE INICIADO ---{Style.RESET_ALL}")
    client = ChatClient()
    client.connect()