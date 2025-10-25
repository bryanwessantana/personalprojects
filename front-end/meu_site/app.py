from flask import Flask, render_template, request, redirect, url_for, session
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)

# Usa variável de ambiente para chave secreta (mais seguro em produção)
app.secret_key = os.environ.get("SECRET_KEY", "dev_key_insegura")

# Usuários simulados (em projeto real, usaria banco de dados)
usuarios = {
    "admin": generate_password_hash("1234"),
    "bryan": generate_password_hash("senha")
}

# Decorador para proteger rotas
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "usuario" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated_function

# Rotas
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        usuario = request.form.get("usuario")
        senha = request.form.get("senha")

        if usuario in usuarios and check_password_hash(usuarios[usuario], senha):
            session["usuario"] = usuario
            return redirect(url_for("dashboard"))
        else:
            return render_template("login.html", erro="Usuário ou senha inválidos!")
    return render_template("login.html")

@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html", usuario=session["usuario"], dark_mode=True)

@app.route("/logout")
@login_required
def logout():
    session.pop("usuario", None)
    return redirect(url_for("home"))

# Roda o site
if __name__ == "__main__":
    app.run(debug=True)
