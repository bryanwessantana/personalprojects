from flask import Flask, render_template, request, redirect, session, url_for
import mysql.connector

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta'  # necessário para sessões

# Conexão com MySQL
def conexao_db():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='Bryan18!',
        database='sistema_login'
    )

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        senha = request.form['senha']

        conn = conexao_db()
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO usuarios (username, senha) VALUES (%s, %s)", (username, senha))
            conn.commit()
            return redirect(url_for('login'))
        except:
            return "Erro: usuário já existe!"
        finally:
            cursor.close()
            conn.close()
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        senha = request.form['senha']

        conn = conexao_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE username = %s AND senha = %s", (username, senha))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            session['usuario'] = username
            return redirect(url_for('painel'))
        else:
            return "Usuário ou senha inválidos!"
    return render_template('login.html')

@app.route('/delete/<username>')
def deletar_usuario(username):
    conn = conexao_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuarios WHERE username = %s", (username,))
    conn.commit()
    cursor.close()
    conn.close()
    return f"Usuário '{username}' foi deletado com sucesso!"

@app.route('/painel')
def painel():
    if 'usuario' in session:
        return f"Bem-vindo, {session['usuario']}! <a href='/logout'>Sair</a>"
    else:
        return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.pop('usuario', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
