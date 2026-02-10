from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Blouse, Category

designs_bp = Blueprint('designs', __name__)

@designs_bp.route('/blouses', methods=['GET'])
def get_blouses():
    """Get all blouses with optional filtering"""
    try:
        fabric_type = request.args.get('fabric_type')
        occasion = request.args.get('occasion')
        
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
                'category': blouse.category.name if blouse.category else None,
                'created_at': blouse.created_at.isoformat() if blouse.created_at else None
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get blouses', 'message': str(e)}), 500

@designs_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    try:
        categories = Category.query.all()
        result = [{'id': cat.id, 'name': cat.name, 'type': cat.type} for cat in categories]
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get categories', 'message': str(e)}), 500

@designs_bp.route('/blouses', methods=['POST'])
@jwt_required()
def create_blouse():
    """Create a new blouse (admin only)"""
    try:
        data = request.get_json()
        
        blouse = Blouse(
            title=data['title'],
            description=data['description'],
            image_url=data.get('image_url', ''),
            category_id=data.get('category_id')
        )
        
        db.session.add(blouse)
        db.session.commit()
        
        return jsonify({
            'id': blouse.id,
            'title': blouse.title,
            'description': blouse.description,
            'image_url': blouse.image_url,
            'category': blouse.category.name if blouse.category else None
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create blouse', 'message': str(e)}), 500
