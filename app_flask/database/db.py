from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey, DateTime, Text, Enum as SAEnum, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload
from datetime import datetime
import json

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# --- Models ---


class Region(Base):
    __tablename__ = 'region'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region", cascade="all, delete")


class Comuna(Base):
    __tablename__ = 'comuna'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)

    region = relationship("Region", back_populates="comunas")
    avisos = relationship("Aviso", back_populates="comuna", cascade="all, delete")


class Aviso(Base):
    __tablename__ = 'aviso_adopcion'

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_ingreso = Column(DateTime, nullable=False)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)
    sector = Column(String(100), nullable=True)
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15), nullable=True)
    tipo = Column(SAEnum('gato', 'perro', name='tipo_enum'), nullable=False)
    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)
    unidad_medida = Column(SAEnum('a', 'm', name='unidad_enum'), nullable=False)
    fecha_entrega = Column(DateTime, nullable=False)
    descripcion = Column(Text, nullable=True)

    comuna = relationship("Comuna", back_populates="avisos")
    fotos = relationship("Foto", back_populates="aviso", cascade="all, delete")
    contactos = relationship("ContactarPor", back_populates="aviso", cascade="all, delete")


class Foto(Base):
    __tablename__ = 'foto'

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)

    aviso = relationship("Aviso", back_populates="fotos")


class ContactarPor(Base):
    __tablename__ = 'contactar_por'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(SAEnum('whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra', name='contacto_enum'), nullable=False)
    identificador = Column(String(150), nullable=False)
    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)

    aviso = relationship("Aviso", back_populates="contactos")

# --- Database Functions ---


def get_aviso(aviso_id):
    session = SessionLocal()
    aviso = session.query(Aviso).options(
        joinedload(Aviso.fotos),
        joinedload(Aviso.contactos),
        joinedload(Aviso.comuna).joinedload(Comuna.region)
    ).filter(Aviso.id == aviso_id).first()
    session.close()
    return aviso


def get_avisos(limit=25, offset=0):
    session = SessionLocal()
    avisos = session.query(Aviso).options(
        joinedload(Aviso.fotos),
        joinedload(Aviso.contactos),
        joinedload(Aviso.comuna)
    ).order_by(Aviso.fecha_ingreso.desc()).limit(limit).offset(offset).all()
    session.close()
    return avisos


def count_avisos():
    session = SessionLocal()
    total = session.query(func.count(Aviso.id)).scalar()
    session.close()
    return total

def get_comuna_id_by_name(nombre_comuna):
    session = SessionLocal()
    if not nombre_comuna:
        session.close()
        return None

    name = str(nombre_comuna).strip()
    comuna = session.query(Comuna).filter(func.lower(Comuna.nombre) == name.lower()).first()
    if comuna:
        cid = comuna.id
        session.close()
        return cid
    session.close()
    return None

def create_foto(session, aviso_id, ruta_archivo, nombre_archivo):
    foto = Foto(ruta_archivo=ruta_archivo, nombre_archivo=nombre_archivo, aviso_id=aviso_id)
    session.add(foto)
    return foto


def create_contacto(session, aviso_id, nombre, identificador):
    if not nombre:
        raise ValueError('Contacto sin nombre')
    n = str(nombre).strip().lower()
    mapping = {
        'whatsapp': 'whatsapp',
        'telegram': 'telegram',
        'x': 'X',
        'instagram': 'instagram',
        'tiktok': 'tiktok',
        'otro': 'otra',
        'otra': 'otra'
    }
    norm = mapping.get(n)
    if norm is None:
        if 'what' in n or n.startswith('wa'):
            norm = 'whatsapp'
        elif 'tele' in n:
            norm = 'telegram'
        elif n in ('x', 'twitter'):
            norm = 'X'
        elif 'insta' in n:
            norm = 'instagram'
        elif 'tik' in n:
            norm = 'tiktok'
        else:
            norm = 'otra'

    contacto = ContactarPor(nombre=norm, identificador=identificador, aviso_id=aviso_id)
    session.add(contacto)
    return contacto


def _parse_datetime(value):
    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    s = str(value)
    try:
        return datetime.fromisoformat(s)
    except Exception:
        pass
    for fmt in ("%Y-%m-%dT%H:%M", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(s, fmt)
        except Exception:
            continue
    return None



def create_aviso(aviso_data: dict, fotos: list = None, contactos: list = None):
    session = SessionLocal()
    try:
        fecha_ingreso = aviso_data.get('fecha_ingreso')
        fecha_entrega = aviso_data.get('fecha_entrega')
        if isinstance(fecha_ingreso, str):
            fecha_ingreso = _parse_datetime(fecha_ingreso)
        if isinstance(fecha_entrega, str):
            fecha_entrega = _parse_datetime(fecha_entrega)

        comuna_id = aviso_data.get('comuna_id')
        if comuna_id in (None, ''):
            raise ValueError('comuna_id es requerido')
        comuna_id = int(comuna_id)

        tipo_raw = aviso_data.get('tipo')
        tipo_val = None
        if tipo_raw:
            tr = str(tipo_raw).strip().lower()
            if 'perr' in tr:
                tipo_val = 'perro'
            elif 'gat' in tr:
                tipo_val = 'gato'
            else:
                tipo_val = tr

        unidad_raw = aviso_data.get('unidad_medida')
        unidad_val = None
        if unidad_raw:
            ur = str(unidad_raw).strip().lower()
            if ur.startswith('m'):
                unidad_val = 'm'
            elif ur.startswith('a'):
                unidad_val = 'a'
            else:
                unidad_val = ur

        cantidad = aviso_data.get('cantidad')
        edad = aviso_data.get('edad')
        cantidad_val = int(cantidad) if cantidad not in (None, '') else None
        edad_val = int(edad) if edad not in (None, '') else None

        new_aviso = Aviso(
            fecha_ingreso=fecha_ingreso or datetime.now(),
            comuna_id=comuna_id,
            sector=aviso_data.get('sector'),
            nombre=aviso_data.get('nombre'),
            email=aviso_data.get('email'),
            celular=aviso_data.get('celular'),
            tipo=tipo_val,
            cantidad=cantidad_val,
            edad=edad_val,
            unidad_medida=unidad_val,
            fecha_entrega=fecha_entrega,
            descripcion=aviso_data.get('descripcion')
        )

        session.add(new_aviso)
        session.flush()  

        if fotos:
            for f in fotos:
                create_foto(session, new_aviso.id, f.get('ruta_archivo'), f.get('nombre_archivo'))

        if contactos:
            for c in contactos:
                create_contacto(session, new_aviso.id, c.get('nombre'), c.get('identificador'))

        session.commit()
        aviso_id = new_aviso.id
        session.close()
        return aviso_id
    except Exception:
        session.rollback()
        session.close()
        raise


def stats_avisos_por_dia():
    """Devuelve lista de {'date': 'YYYY-MM-DD', 'count': N} ordenada por fecha asc."""
    session = SessionLocal()
    rows = session.query(func.date(Aviso.fecha_ingreso).label('dia'), func.count(Aviso.id).label('cantidad'))
    rows = rows.group_by(func.date(Aviso.fecha_ingreso)).order_by(func.date(Aviso.fecha_ingreso)).all()
    result = []
    for r in rows:
        dia = r.dia.isoformat() if hasattr(r.dia, 'isoformat') else str(r.dia)
        result.append({'date': dia, 'count': int(r.cantidad)})
    session.close()
    return result


def stats_avisos_por_tipo():
    """Devuelve conteo total por tipo (gato/perro). Retorna lista de {'tipo': t, 'count': n}."""
    session = SessionLocal()
    rows = session.query(Aviso.tipo.label('tipo'), func.count(Aviso.id).label('cantidad'))
    rows = rows.group_by(Aviso.tipo).all()
    result = []
    for r in rows:
        result.append({'tipo': r.tipo, 'count': int(r.cantidad)})
    session.close()
    return result


def stats_avisos_por_mes_y_tipo():
    """Devuelve una lista por mes con conteos por tipo.
    Retorna [{'month':'YYYY-MM','gato':n,'perro':m}, ...] ordenado por month asc.
    """
    session = SessionLocal()
    # Usar date_format de MySQL para agrupar por año-mes
    month_expr = func.date_format(Aviso.fecha_ingreso, '%Y-%m')
    rows = session.query(month_expr.label('mes'), Aviso.tipo.label('tipo'), func.count(Aviso.id).label('cantidad'))
    rows = rows.group_by('mes', Aviso.tipo).order_by('mes').all()

    data = {}
    months_order = []
    for r in rows:
        mes = r.mes
        tipo = r.tipo
        cantidad = int(r.cantidad)
        if mes not in data:
            data[mes] = {'gato': 0, 'perro': 0}
            months_order.append(mes)
        data[mes][tipo] = cantidad

    result = []
    for m in months_order:
        entry = {'month': m, 'gato': data[m].get('gato', 0), 'perro': data[m].get('perro', 0)}
        result.append(entry)

    session.close()
    return result
