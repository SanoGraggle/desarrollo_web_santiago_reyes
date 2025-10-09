from flask import Flask, render_template, send_from_directory, url_for, redirect, request, flash
import os
from werkzeug.utils import secure_filename
from database import db
from datetime import datetime

app = Flask(__name__, static_folder='static', template_folder='templates')

UPLOAD_FOLDER = 'resources/uploads'
app.secret_key = 'secret_key'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    recent_avisos = db.get_avisos(limit=5, offset=0)
    return render_template('index.html', recent_avisos=recent_avisos)


@app.route('/formulario', methods=['GET', 'POST'])
def formulario():
    if request.method == 'POST':
        region_val = request.form.get('region')              
        comuna_val = request.form.get('comuna')             
        sector = request.form.get('sector')
        nombre = request.form.get('name')                   
        email = request.form.get('email')
        celular = request.form.get('phone')
        contacto_metodo = request.form.get('contact')     
        contacto_identificador = request.form.get('username')  
        tipo = request.form.get('type')
        cantidad = request.form.get('quantity')
        edad = request.form.get('age')
        unidad_medida_raw = request.form.get('age-type')    
        adopt_date_str = request.form.get('adopt_date')     
        descripcion = request.form.get('description')

        
        unidad_medida = None
        if unidad_medida_raw:
            u = unidad_medida_raw.lower()
            if 'a' in u:
                unidad_medida = 'a'
            elif 'm' in u:
                unidad_medida = 'm'

        fecha_entrega = None
        if adopt_date_str:
            try:
                fecha_entrega = datetime.fromisoformat(adopt_date_str)
            except Exception:
                try:
                    fecha_entrega = datetime.strptime(adopt_date_str, '%Y-%m-%dT%H:%M')
                except Exception:
                    try:
                        fecha_entrega = datetime.strptime(adopt_date_str, '%Y-%m-%d')
                    except Exception:
                        flash('Formato de fecha inválido')
                        return redirect(url_for('formulario'))

        fotos = []
        if 'files' in request.files:
            uploaded_files = request.files.getlist('files')
            resources_dir = os.path.join(app.root_path, 'resources')
            upload_dir = os.path.join(resources_dir, 'uploads')
            os.makedirs(upload_dir, exist_ok=True)
            for f in uploaded_files:
                if f and f.filename:
                    filename = secure_filename(f.filename)
                    save_path = os.path.join(upload_dir, filename)
                    f.save(save_path)
                    ruta_rel = os.path.join('uploads', filename).replace('\\', '/')
                    fotos.append({'ruta_archivo': ruta_rel, 'nombre_archivo': filename})

        contactos = []
        if contacto_metodo:
            ident = contacto_identificador or ''
            if contacto_metodo.lower() in ('email',) and email:
                ident = email
            if contacto_metodo.lower() in ('telefono', 'phone', 'celular') and celular:
                ident = celular
            if ident:
                contactos.append({'nombre': contacto_metodo, 'identificador': ident})

        comuna_id = db.get_comuna_id_by_name(comuna_val)

        aviso_data = {
            'fecha_ingreso': datetime.now(),
            'comuna_id': comuna_id,
            'sector': sector,
            'nombre': nombre,
            'email': email,
            'celular': celular,
            'tipo': tipo,
            'cantidad': cantidad,
            'edad': edad,
            'unidad_medida': unidad_medida,
            'fecha_entrega': fecha_entrega,
            'descripcion': descripcion
        }

        try:
            new_id = db.create_aviso(aviso_data, fotos=fotos, contactos=contactos)
            flash('Aviso creado correctamente')
            return redirect(url_for('home'))
        except Exception as e:
            flash(f'Error al crear aviso: {e}')
            return redirect(url_for('formulario'))

    return render_template('formulario.html')


@app.route('/listado')
def listado():
    try:
        page = int(request.args.get('page', '1'))
        if page < 1:
            page = 1
    except Exception:
        page = 1

    per_page = 5
    offset = (page - 1) * per_page
    total = db.count_avisos()
    avisos = db.get_avisos(limit=per_page, offset=offset)

    total_pages = (total + per_page - 1) // per_page if total else 1

    return render_template('listado.html', avisos=avisos, page=page, total_pages=total_pages)


@app.route('/info_adop')
def info_adop():
    return redirect(url_for('listado'))


@app.route('/info_adop/<int:aviso_id>')
def info_adop_detail(aviso_id: int):
    aviso = db.get_aviso(aviso_id)
    if aviso is None:
        flash('Aviso no encontrado')
        return redirect(url_for('listado'))
    return render_template('info_adop.html', aviso=aviso)


@app.route('/visualizacion')
def visualizacion():
    return render_template('visualizacion.html')


@app.route('/estadisticas')
def estadisticas():
    return render_template('estadisticas.html')


@app.route('/resources/<path:filename>')
def resources(filename):
    base = os.path.abspath(os.path.dirname(__file__))
    resources_dir = os.path.join(base, 'resources')
    return send_from_directory(resources_dir, filename)


if __name__ == '__main__':
    app.run(debug=True)