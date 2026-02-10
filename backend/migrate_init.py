#!/usr/bin/env python
"""
Initialize database migrations for Flask-Migrate
"""
import os
import sys
from flask_migrate import init, migrate, upgrade
from app import create_app, db
from models import User, Blouse, Category

def init_migrations():
    """Initialize Flask-Migrate and create initial migration"""
    app = create_app()
    
    with app.app_context():
        # Initialize migrations
        try:
            init()
            print("Migration repository initialized.")
        except Exception as e:
            print(f"Migration repository might already exist: {e}")
        
        # Create initial migration
        try:
            migrate(message='Initial migration')
            print("Initial migration created.")
        except Exception as e:
            print(f"Error creating migration: {e}")
        
        # Apply migration
        try:
            upgrade()
            print("Migration applied successfully.")
        except Exception as e:
            print(f"Error applying migration: {e}")

if __name__ == '__main__':
    init_migrations()
