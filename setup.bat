@echo off
echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo Setting up Flask app...
set FLASK_APP=app.py

echo Initializing database migrations...
flask db init

echo Creating initial migration...
flask db migrate -m "Initial migration"

echo Applying migrations...
flask db upgrade

echo Setup complete! Run 'python run.py' to start the application.
pause
