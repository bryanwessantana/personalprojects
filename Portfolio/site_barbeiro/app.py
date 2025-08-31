from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime

app = Flask(__name__)

# Função para pegar o ano atual (para o footer)
def current_year():
    return datetime.now().year

# ROTAS

@app.route('/')
def home():
    return render_template(
        'home.html',
        active_page='home',
        current_year=current_year()
    )

@app.route('/agendamento', methods=['GET', 'POST'])
def agendamento():
    if request.method == 'POST':
        # Aqui você pode pegar os dados do formulário
        nome = request.form.get('name')
        email = request.form.get('email')
        servico = request.form.get('service')
        data = request.form.get('date')
        horario = request.form.get('time')

        # Exemplo: apenas imprimir no console
        print(f"Agendamento: {nome}, {email}, {servico}, {data}, {horario}")

        # Redirecionar para home ou página de confirmação
        return redirect(url_for('home'))

    return render_template(
        'agendamento.html',
        active_page='agendamento',
        current_year=current_year()
    )

@app.route('/sobre')
def sobre():
    return render_template(
        'sobre.html',
        active_page='sobre',
        current_year=current_year()
    )

@app.route('/login')
def login():
    return render_template(
        'login.html',
        active_page='login',
        current_year=current_year()
    )

@app.route('/esqueceu_senha')
def esqueceu_senha():
    return "Página em construção"

@app.route('/cadastro')
def cadastro():
    return "Página em construção"

# RUN
if __name__ == '__main__':
    app.run(debug=True)
