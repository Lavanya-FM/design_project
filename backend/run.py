from app import create_app
from models import db
import os

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Add sample data if tables are empty
        from models import Category, Blouse
        
        # Add sample categories
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
        if Blouse.query.count() == 0:
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
