from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = "segredo-super-seguro"

# ========= CONTEXTOS ========= #
@app.context_processor
def inject_now():
    return {"current_year": datetime.now().year}

# ========= ROTAS PRINCIPAIS ========= #
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/portfolio")
def portfolio():
    return render_template("portfolio.html")

@app.route("/sobre")
def sobre():
    return render_template("sobre.html")

@app.route("/contato", methods=["GET", "POST"])
def contato():
    if request.method == "POST":
        nome = request.form.get("nome")
        email = request.form.get("email")
        mensagem = request.form.get("mensagem")

        print(f"📩 Nova mensagem de {nome} ({email}): {mensagem}")

        flash("Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.")
        return redirect(url_for("contato"))

    return render_template("contato.html")

# ========= ROTAS EXTRAS ========= #
@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static"),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon"
    )

# ========= TRATAMENTO DE ERROS ========= #
@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template("500.html"), 500

# ========= RODAR APP ========= #
if __name__ == "__main__":
    app.run(debug=True, port=5000)
