# Real-Time Chat Application w/ AI Responses using Flask-SocketIO and OpenAI:

# Python/Async: Requires the use of technologies like WebSockets 
# (e.g., Flask-SocketIO or Django Channels) to allow messages to be 
# sent and received instantly without reloading the page.

# Front-end: Interactive chat interface that uses JavaScript to 
# display new messages dynamically.

# ------------------------------------------------------------------------------------------- #
import socket
import threading
import os
from datetime import datetime
from dotenv import load_dotenv

# --- BIBLIOTECAS DO GOOGLE GEMINI ---
from google import genai
from google.genai.errors import APIError

# Carrega a chave do arquivo .env
load_dotenv()

# Configurações de Rede
HOST = '127.0.0.1'
PORT = 55555

class ChatServer:
    def __init__(self):
        self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server.bind((HOST, PORT))
        self.server.listen()
        
        self.clients = []
        self.nicknames = []
        
        # Configuração da IA Gemini
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.ai_client = None
        
        # Modelo que usaremos (o Flash é rápido e gratuito)
        self.model_name = 'gemini-2.0-flash'
        
        if self.api_key:
            try:
                # Inicializa o cliente Gemini
                self.ai_client = genai.Client(api_key=self.api_key)
                print(f"✅ [SISTEMA] Google Gemini configurado com sucesso via .env")
            except Exception as e:
                print(f"⚠️ [SISTEMA] Erro ao configurar Gemini: {e}")
        else:
            print("⚠️ [SISTEMA] Chave GEMINI_API_KEY não encontrada no arquivo .env")

    def broadcast(self, message):
        """Envia mensagem para todos os conectados."""
        for client in self.clients:
            try:
                client.send(message)
            except:
                pass

    def get_ai_response(self, prompt):
        """Pede resposta ao Google Gemini."""
        if not self.ai_client:
            return "🤖 Bot: Estou sem minha chave GEMINI_API_KEY no arquivo .env!"
        
        try:
            # Chama a API do Google
            response = self.ai_client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            # O Google retorna o texto em response.text
            return f"🤖 Gemini: {response.text}"
            
        except APIError as e:
            return f"🤖 Bot (Erro API): {e}"
        except Exception as e:
            return f"🤖 Bot (Erro): {e}"

    def handle_client(self, client):
        """Gerencia um cliente específico."""
        while True:
            try:
                message = client.recv(1024)
                msg_decoded = message.decode('utf-8')
                
                timestamp = datetime.now().strftime('%H:%M')
                final_msg = f"[{timestamp}] {msg_decoded}"
                
                self.broadcast(final_msg.encode('utf-8'))

                # Lógica para acionar a IA
                if "IA:" in msg_decoded or "ia:" in msg_decoded:
                    # Separa o comando da pergunta
                    parts = msg_decoded.split(":", 2)
                    if len(parts) > 1:
                        prompt = parts[-1].strip()
                        print(f"🔄 [IA] Processando: {prompt}")
                        
                        # Pega a resposta e envia
                        resposta = self.get_ai_response(prompt)
                        self.broadcast(f"[{timestamp}] {resposta}".encode('utf-8'))

            except:
                if client in self.clients:
                    index = self.clients.index(client)
                    self.clients.remove(client)
                    client.close()
                    nickname = self.nicknames[index]
                    self.broadcast(f"⚠️ {nickname} saiu do chat!".encode('utf-8'))
                    self.nicknames.remove(nickname)
                    break

    def start(self):
        print(f"🚀 Servidor Gemini rodando em {HOST}:{PORT}")
        print("⏳ Aguardando conexões...")
        
        while True:
            client, address = self.server.accept()
            print(f"✅ [CONECTADO] {str(address)}")

            client.send('NICK'.encode('utf-8'))
            nickname = client.recv(1024).decode('utf-8')
            
            self.nicknames.append(nickname)
            self.clients.append(client)

            self.broadcast(f"✨ {nickname} entrou no chat!".encode('utf-8'))
            client.send('✅ Conectado! Digite "IA: pergunta" para falar com o Gemini.'.encode('utf-8'))

            thread = threading.Thread(target=self.handle_client, args=(client,))
            thread.start()

if __name__ == "__main__":
    chat_server = ChatServer()
    chat_server.start()