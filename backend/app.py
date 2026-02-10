from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import json

app = Flask(__name__)

# PHASE 7 — BACKEND SETUP
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or 'sqlite:///fit_flare.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string'

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# MODELS
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Design(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    neck = db.Column(db.JSON)  # Stores array of strings
    sleeve = db.Column(db.JSON)
    fabric = db.Column(db.JSON)
    work = db.Column(db.JSON)
    tags = db.Column(db.JSON)
    image = db.Column(db.String(500))
    price = db.Column(db.Float)
    popularity = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    design_id = db.Column(db.Integer, db.ForeignKey('design.id'))
    status = db.Column(db.String(50), default='PLACED') # PHASE 8 Logic
    customization_details = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    finished_image = db.Column(db.String(500)) # PHASE 9 Admin

# SEEDING LOGIC
@app.route('/api/seed', methods=['POST'])
def seed_designs():
    # Only for dev
    designs_data = [
        {
            "name": "Royal Zardosi Silk", "neck": ["Deep U"], "sleeve": ["Elbow Length"], 
            "fabric": ["Raw Silk"], "work": ["Hand Zardosi"], "tags": ["bridal", "wedding"],
            "image": "/images/blouses/royal-zardosi.jpg", "price": 4500, "popularity": 10
        },
        {
            "name": "Mirror Glow Glam", "neck": ["V Neck"], "sleeve": ["Sleeveless"],
            "fabric": ["Velvet"], "work": ["Real Mirror Work"], "tags": ["party", "mirror"],
            "image": "/images/blouses/mirror-glam.jpg", "price": 3200, "popularity": 9
        }
    ]
    for d in designs_data:
        if not Design.query.filter_by(name=d['name']).first():
            new_d = Design(**d)
            db.session.add(new_d)
    db.session.commit()
    return jsonify({"message": "Designs seeded successfully"}), 201

# API ROUTES
@app.route('/api/designs', methods=['GET'])
def get_designs():
    designs = Design.query.all()
    result = []
    for d in designs:
        result.append({
            "id": d.id, "name": d.name, "neck": d.neck, "sleeve": d.sleeve,
            "fabric": d.fabric, "work": d.work, "tags": d.tags,
            "image": d.image, "price": d.price, "popularity": d.popularity
        })
    return jsonify(result)

@app.route('/api/designs', methods=['POST'])
def create_design():
    data = request.json
    new_design = Design(
        name=data.get('name'), neck=data.get('neck'), sleeve=data.get('sleeve'),
        fabric=data.get('fabric'), work=data.get('work'), tags=data.get('tags'),
        image=data.get('image'), price=data.get('price'), 
        popularity=data.get('popularity', 0)
    )
    db.session.add(new_design)
    db.session.commit()
    return jsonify({"message": "Design created", "id": new_design.id}), 201

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "User exists"}), 400
    user = User(
        email=data.get('email'),
        password_hash=generate_password_hash(data.get('password')),
        first_name=data.get('first_name'),
        last_name=data.get('last_name')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created"}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get('email')).first()
    if user and check_password_hash(user.password_hash, data.get('password')):
        token = create_access_token(identity=user.id)
        return jsonify({"access_token": token, "user": {"id": user.id, "email": user.email}}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/orders', methods=['POST'])
@jwt_required()
def place_order():
    data = request.json
    user_id = get_jwt_identity()
    new_order = Order(
        user_id=user_id,
        design_id=data.get('designId'),
        customization_details=data.get('details'),
        status='PLACED'
    )
    db.session.add(new_order)
    db.session.commit()
    return jsonify({"message": "Order placed", "orderId": new_order.id}), 201

@app.route('/api/admin/orders', methods=['GET'])
def admin_orders():
    orders = Order.query.all()
    result = []
    for o in orders:
        result.append({
            "id": o.id, "status": o.status, "created_at": o.created_at.isoformat(),
            "user_id": o.user_id, "design_id": o.design_id
        })
    return jsonify(result)

@app.route('/api/admin/orders/<int:id>', methods=['PATCH'])
def update_order_status(id):
    data = request.json
    order = Order.query.get_or_404(id)
    if 'status' in data: order.status = data['status']
    if 'finished_image' in data: order.finished_image = data['finished_image']
    db.session.commit()
    return jsonify({"message": "Order updated"})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001) # Port changed to avoid conflict with Express if still running
