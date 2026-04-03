-- Seed data for optimized designs table
INSERT INTO designs (id, title, description, price, is_customizable, neck_type, sleeve_type, back_type, work_type, fabric, occasion, images)
VALUES 
(
    uuid_generate_v4(),
    'Royal Bridal Aari Blouse',
    'Heavily embellished bridal blouse with intricate aari work and stones.',
    4500.00,
    true,
    'boat',
    'short',
    'knot',
    'aari',
    'silk',
    'bridal',
    '["/static/images/designs/bridal_aari_1.jpg", "/static/images/designs/bridal_aari_2.jpg"]'
),
(
    uuid_generate_v4(),
    'Modern Halter Neck Blouse',
    'Contemporary halter neck blouse with minimal embroidery.',
    1800.00,
    true,
    'halter',
    'sleeveless',
    'open',
    'embroidery',
    'cotton',
    'reception',
    '["/static/images/designs/halter_modern_1.jpg"]'
),
(
    uuid_generate_v4(),
    'Deep V-Back Silk Blouse',
    'Elegant deep V-back blouse in raw silk with zari borders.',
    2200.00,
    true,
    'deep_back',
    'elbow',
    'zip',
    'zari',
    'silk',
    'party',
    '["/static/images/designs/vback_silk_1.jpg"]'
);
