from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or 'sqlite:///fit_flare.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string'

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000'])

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<User {self.email}>'

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    
    def __repr__(self):
        return f'<Category {self.name}>'

class Blouse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    category = db.relationship('Category', backref=db.backref('blouses', lazy=True))
    
    def __repr__(self):
        return f'<Blouse {self.title}>'

# Routes
@app.route('/')
def index():
    return jsonify({'message': 'Fit & Flare Studio API', 'version': '1.0.0'})

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'database': 'connected'})

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        required_fields = ['email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        email = data['email'].lower().strip()
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        user = User(
            email=email,
            password_hash=generate_password_hash(data['password']),
            first_name=data['first_name'].strip(),
            last_name=data['last_name'].strip(),
            phone=data.get('phone')
        )
        
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            },
            'access_token': access_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'message': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].lower().strip()
        user = User.query.filter_by(email=email).first()
        
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            },
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed', 'message': str(e)}), 500

@app.route('/api/designs/blouses', methods=['GET'])
def get_blouses():
    try:
        fabric_type = request.args.get('fabric_type')
        
        query = Blouse.query
        
        if fabric_type and fabric_type != 'All Fabrics':
            category = Category.query.filter_by(name=fabric_type).first()
            if category:
                query = query.filter_by(category_id=category.id)
        
        blouses = query.all()
        result = []
        for blouse in blouses:
            result.append({
                'id': blouse.id,
                'title': blouse.title,
                'description': blouse.description,
                'image_url': blouse.image_url,
                'category': blouse.category.name if blouse.category else None
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get blouses', 'message': str(e)}), 500

@app.route('/api/designs/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        result = [{'id': cat.id, 'name': cat.name, 'type': cat.type} for cat in categories]
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get categories', 'message': str(e)}), 500

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': user.phone,
            'created_at': user.created_at.isoformat() if user.created_at else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get profile', 'message': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        # Initialize database
        db.create_all()
        
        # Add sample data if empty
        if Category.query.count() == 0:
            fabric_categories = [
                Category(name='Traditional Silks', type='fabric'),
                Category(name='Contemporary Cottons', type='fabric'),
                Category(name='Organza & Sheer', type='fabric'),
                Category(name='Linen Blends', type='fabric')
            ]
            
            occasion_categories = [
                Category(name='Bridal', type='occasion'),
                Category(name='Festive', type='occasion'),
                Category(name='Casual', type='occasion'),
                Category(name='Formal', type='occasion')
            ]
            
            db.session.add_all(fabric_categories)
            db.session.add_all(occasion_categories)
            db.session.commit()
            
            # Add sample blouses
            silk_category = Category.query.filter_by(name='Traditional Silks').first()
            cotton_category = Category.query.filter_by(name='Contemporary Cottons').first()
            
            sample_blouses = [
                Blouse(
                    title='Traditional Silks',
                    description='Rich Banarasi and Kanjeevaram textures adorned with meticulous Zardozi handwork.',
                    image_url='https://picsum.photos/seed/silk1/300/400.jpg',
                    category_id=silk_category.id if silk_category else None
                ),
                Blouse(
                    title='Contemporary Cottons',
                    description='Breathable, organic weaves featuring modern silhouettes and understated wooden button details.',
                    image_url='https://picsum.photos/seed/cotton1/300/400.jpg',
                    category_id=cotton_category.id if cotton_category else None
                ),
                Blouse(
                    title='Designer Backs',
                    description='A focus on the unexpected. Geometric cut-outs, tie-up latkans, and sheer panelling.',
                    image_url='https://picsum.photos/seed/designer1/300/400.jpg'
                ),
                Blouse(
                    title='Ethereal Organza',
                    description='Light-as-air fabrics paired with delicate floral appliques and glass bead embroidery.',
                    image_url='https://picsum.photos/seed/organza1/300/400.jpg'
                ),
                Blouse(
                    title='Velvet Nights',
                    description='Rich, plush velvets in jewel tones, perfect for winter weddings and grand galas.',
                    image_url='https://picsum.photos/seed/velvet1/300/400.jpg'
                ),
                Blouse(
                    title='Indigo Tales',
                    description='Hand-block printed Ajrakh and Dabu cottons celebrating ancient dyeing traditions.',
                    image_url='https://picsum.photos/seed/indigo1/300/400.jpg'
                )
            ]
            
            db.session.add_all(sample_blouses)
            db.session.commit()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
