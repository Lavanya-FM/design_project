import sqlite3
import os

db_path = r'c:\Users\lavan\OneDrive\Desktop\design_project\backend\instance\fit_flare.db'
if not os.path.exists(db_path):
    print(f"DB not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
c = conn.cursor()
try:
    c.execute('ALTER TABLE design ADD COLUMN angles JSON')
    conn.commit()
    print("Column 'angles' added successfully.")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e).lower():
        print("Column 'angles' already exists.")
    else:
        print(f"OperationalError: {e}")
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()
