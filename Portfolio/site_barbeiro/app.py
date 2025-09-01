import os
from datetime import datetime, time as dtime
from flask import Flask, render_template, request, redirect, url_for, flash, session, abort
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask_mail import Mail, Message

# ------------------------------
# Configuração básica
# ------------------------------
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///barbearia.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Emails (opcional; configure variáveis de ambiente para funcionar de verdade)
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')  # seu email
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')  # senha/app password
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', app.config['MAIL_USERNAME'])

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
mail = Mail(app)
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# ------------------------------
# Modelos
# ------------------------------
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(60), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='cliente')  # 'cliente' ou 'barbeiro'
    feedbacks = db.relationship('Feedback', backref='author', lazy=True)
    appointments = db.relationship('Appointment', backref='owner', lazy=True)

    def set_password(self, raw):
        self.password_hash = generate_password_hash(raw)

    def check_password(self, raw):
        return check_password_hash(self.password_hash, raw)

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # pode agendar sem login
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    service = db.Column(db.String(80), nullable=False)
    barber = db.Column(db.String(40), nullable=False)         # ex: 'everthon', 'dudu', 'qualquer'
    people = db.Column(db.Integer, default=1)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), default='confirmado')   # 'confirmado' | 'cancelado'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    stars = db.Column(db.Integer, nullable=False)  # 1..5
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# ------------------------------
# Login manager
# ------------------------------
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ------------------------------
# Utils
# ------------------------------
def current_year():
    return datetime.now().year

def is_valid_business_datetime(date_obj, time_obj):
    # Segunda=0 ... Domingo=6
    weekday = date_obj.weekday()
    if weekday == 6:  # domingo
        return False
    # 09:00–19:00 (19:00 incluso)
    start = dtime(9, 0)
    end = dtime(19, 0)
    return start <= time_obj <= end

def send_email(subject, recipients, body):
    """Envia email se o Mail estiver configurado; caso contrário, ignora sem erro."""
    try:
        if app.config['MAIL_USERNAME'] and app.config['MAIL_PASSWORD']:
            msg = Message(subject, recipients=recipients, body=body)
            mail.send(msg)
    except Exception as e:
        # Em dev, só registra no console
        print("Falha ao enviar email:", e)

def require_role(role):
    if not current_user.is_authenticated or current_user.role != role:
        abort(403)

# ------------------------------
# Rotas públicas
# ------------------------------
@app.route('/')
def home():
    # média de estrelas + últimos 6 feedbacks
    latest = Feedback.query.order_by(Feedback.created_at.desc()).limit(6).all()
    # média (se não houver feedbacks, evita ZeroDivisionError)
    avg = None
    count = Feedback.query.count()
    if count:
        total = db.session.query(db.func.sum(Feedback.stars)).scalar() or 0
        avg = round(total / count, 1)
    return render_template('home.html',
                           active_page='home',
                           current_year=current_year(),
                           feedbacks=latest,
                           avg_stars=avg,
                           feedback_count=count)

@app.route('/agendamento', methods=['GET', 'POST'])
def agendamento():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        service = request.form.get('service', '').strip()
        barber = request.form.get('barber', '').strip() or 'qualquer'
        people = int(request.form.get('pessoas', '1') or 1)
        date_str = request.form.get('date')
        time_str = request.form.get('time')

        # validações básicas
        if not all([name, email, service, date_str, time_str]):
            flash("Preencha todos os campos.", "error")
            return redirect(url_for('agendamento'))

        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            time_obj = datetime.strptime(time_str, "%H:%M").time()
        except ValueError:
            flash("Data ou hora inválida.", "error")
            return redirect(url_for('agendamento'))

        if not is_valid_business_datetime(date_obj, time_obj):
            flash("Agende apenas de segunda a sábado, das 09h às 19h.", "error")
            return redirect(url_for('agendamento'))

        # (opcional) bloquear horários já ocupados por barbeiro específico:
        conflict = Appointment.query.filter_by(
            barber=barber, date=date_obj, time=time_obj, status='confirmado'
        ).first() if barber != 'qualquer' else None
        if conflict:
            flash("Este horário já está ocupado para o barbeiro escolhido.", "error")
            return redirect(url_for('agendamento'))

        appt = Appointment(
            user_id=current_user.id if current_user.is_authenticated else None,
            name=name, email=email, service=service, barber=barber,
            people=people, date=date_obj, time=time_obj
        )
        db.session.add(appt)
        db.session.commit()

        # emails (cliente + barbeiro escolhido, se houver mapeamento)
        barber_emails = {
            'everthon': os.environ.get('BARBER_EVERTHON_EMAIL'),
            'dudu': os.environ.get('BARBER_DUDU_EMAIL')
        }
        # cliente
        send_email(
            "Confirmação de Agendamento - Thon Barbearia",
            [email],
            f"Olá {name}, seu agendamento foi confirmado:\n"
            f"Serviço: {service}\nBarbeiro: {barber}\nData: {date_str}\nHorário: {time_str}\nPessoas: {people}"
        )
        # barbeiro (se específico)
        if barber in barber_emails and barber_emails[barber]:
            send_email(
                "Novo agendamento",
                [barber_emails[barber]],
                f"Novo agendamento:\nCliente: {name}\nServiço: {service}\nData: {date_str} {time_str}\nPessoas: {people}"
            )

        # tela de confirmação com diálogo e redirect
        return render_template('confirmacao.html', nome=name, data=date_str, horario=time_str)

    return render_template('agendamento.html',
                           active_page='agendamento',
                           current_year=current_year())

@app.route('/sobre')
def sobre():
    return render_template('sobre.html',
                           active_page='sobre',
                           current_year=current_year())

# ------------------------------
# Auth: cadastro / login / logout
# ------------------------------
@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        username = request.form.get('usuario', '').strip()
        email = request.form.get('email', '').strip().lower()
        senha = request.form.get('senha', '')
        if not all([username, email, senha]):
            flash("Preencha usuário, email e senha.", "error")
            return redirect(url_for('cadastro'))
        if User.query.filter((User.username == username) | (User.email == email)).first():
            flash("Usuário ou email já cadastrado.", "error")
            return redirect(url_for('cadastro'))
        user = User(username=username, email=email)
        user.set_password(senha)
        db.session.add(user)
        db.session.commit()
        flash("Cadastro realizado! Faça login.", "success")
        return redirect(url_for('login'))
    return render_template('cadastro.html', active_page='login', current_year=current_year())

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form.get('usuario', '').strip()
        senha = request.form.get('senha', '')
        user = User.query.filter((User.username == usuario) | (User.email == usuario)).first()
        if user and user.check_password(senha):
            login_user(user)
            flash("Login efetuado!", "success")
            return redirect(url_for('home'))
        else:
            return render_template('login.html', erro="Usuário ou senha inválidos.", active_page='login',
                                   current_year=current_year())
    return render_template('login.html', active_page='login', current_year=current_year())

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Você saiu da sua conta.", "success")
    return redirect(url_for('home'))

# ------------------------------
# Esqueceu a senha (com token)
# ------------------------------
@app.route('/esqueceu_senha', methods=['GET', 'POST'])
def esqueceu_senha():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        user = User.query.filter_by(email=email).first()
        if user:
            token = serializer.dumps(email, salt="reset-senha")
            reset_url = url_for('reset_senha', token=token, _external=True)
            send_email("Redefinição de senha",
                       [email],
                       f"Clique para redefinir sua senha: {reset_url}\n(O link expira em 1 hora)")
            flash("Se o email existir, enviaremos instruções de redefinição.", "info")
        else:
            flash("Se o email existir, enviaremos instruções de redefinição.", "info")
        return redirect(url_for('login'))
    return render_template('esqueceu_senha.html', active_page='login', current_year=current_year())

@app.route('/reset_senha/<token>', methods=['GET', 'POST'])
def reset_senha(token):
    try:
        email = serializer.loads(token, salt="reset-senha", max_age=3600)
    except (SignatureExpired, BadSignature):
        flash("Link inválido ou expirado.", "error")
        return redirect(url_for('esqueceu_senha'))

    if request.method == 'POST':
        senha = request.form.get('senha', '')
        if not senha:
            flash("Informe uma nova senha.", "error")
            return redirect(request.url)
        user = User.query.filter_by(email=email).first_or_404()
        user.set_password(senha)
        db.session.commit()
        flash("Senha redefinida! Faça login.", "success")
        return redirect(url_for('login'))

    return render_template('reset_senha.html', email=email, active_page='login', current_year=current_year())

# ------------------------------
# Área do cliente
# ------------------------------
@app.route('/meus-agendamentos')
@login_required
def meus_agendamentos():
    appts = Appointment.query.filter(
        (Appointment.user_id == current_user.id) | (Appointment.email == current_user.email)
    ).order_by(Appointment.date.asc(), Appointment.time.asc()).all()
    return render_template('meus_agendamentos.html', agendamentos=appts, current_year=current_year())

@app.route('/cancelar/<int:appt_id>', methods=['POST'])
@login_required
def cancelar_agendamento(appt_id):
    appt = Appointment.query.get_or_404(appt_id)
    # só o dono pode cancelar
    if appt.user_id != current_user.id and appt.email != current_user.email:
        abort(403)
    appt.status = 'cancelado'
    db.session.commit()
    flash("Agendamento cancelado.", "success")
    return redirect(url_for('meus_agendamentos'))

# ------------------------------
# Painel do barbeiro (agenda)
# ------------------------------
@app.route('/agenda')
@login_required
def agenda_barbeiro():
    if current_user.role != 'barbeiro':
        abort(403)
    # mostra todos os agendamentos confirmados, ordenados
    appts = Appointment.query.filter_by(status='confirmado')\
        .order_by(Appointment.date.asc(), Appointment.time.asc()).all()
    return render_template('agenda_barbeiro.html', agendamentos=appts, current_year=current_year())

# ------------------------------
# Feedback (apenas logado)
# ------------------------------
@app.route('/feedback', methods=['POST'])
@login_required
def feedback():
    stars = int(request.form.get('stars', '0') or 0)
    comment = request.form.get('comment', '').strip()
    if stars < 1 or stars > 5 or not comment:
        flash("Dê uma nota de 1 a 5 e escreva um comentário.", "error")
        return redirect(url_for('home'))
    fb = Feedback(stars=stars, comment=comment, user_id=current_user.id)
    db.session.add(fb)
    db.session.commit()
    flash("Obrigado pelo feedback!", "success")
    return redirect(url_for('home'))

# ------------------------------
# Inicialização do BD
# ------------------------------
@app.cli.command("init-db")
def init_db():
    db.create_all()
    print("Banco inicializado.")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # garante as tabelas em dev
    app.run(debug=True)