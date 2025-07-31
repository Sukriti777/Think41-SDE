import sqlite3
import csv

conn = sqlite3.connect('products.db')
cursor = conn.cursor()

cursor.execute("DROP TABLE IF EXISTS products")
cursor.execute("DROP TABLE IF EXISTS departments")

cursor.execute('''
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
)
''')

cursor.execute('''
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    cost REAL,
    category TEXT,
    name TEXT,
    brand TEXT,
    retail_price REAL,
    department_id INTEGER,
    sku TEXT,
    distribution_center_id TEXT,
    FOREIGN KEY(department_id) REFERENCES departments(id)
)
''')

with open('products.csv', newline='', encoding='utf-8-sig') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        dept_name = row['department']
        cursor.execute("INSERT OR IGNORE INTO departments (name) VALUES (?)", (dept_name,))
        cursor.execute("SELECT id FROM departments WHERE name = ?", (dept_name,))
        dept_id = cursor.fetchone()[0]

        cursor.execute('''
            INSERT OR IGNORE INTO products (
                id, cost, category, name, brand, retail_price,
                department_id, sku, distribution_center_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            row['id'],
            float(row['cost']) if row['cost'] else 0,
            row['category'],
            row['name'],
            row['brand'],
            float(row['retail_price']) if row['retail_price'] else 0,
            dept_id,
            row['sku'],
            row['distribution_center_id']
        ))

conn.commit()

print("Departments:")
for row in cursor.execute('SELECT * FROM departments'):
    print(row)

print("\nSample Products:")
for row in cursor.execute('SELECT * FROM products LIMIT 5'):
    print(row)

conn.close()

# Connect to SQLite database
conn = sqlite3.connect('products.db')
cursor = conn.cursor()

# Drop table if exists (for repeat runs)
cursor.execute("DROP TABLE IF EXISTS products")

# Create products table matching CSV structure
cursor.execute('''
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    cost REAL,
    category TEXT,
    name TEXT,
    brand TEXT,
    retail_price REAL,
    department TEXT,
    sku TEXT,
    distribution_center_id TEXT
)
''')

# Read CSV and insert data
with open('products.csv', newline='', encoding='utf-8-sig') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        cursor.execute('''
            INSERT OR IGNORE INTO products (
                id, cost, category, name, brand, retail_price,
                department, sku, distribution_center_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            row['id'],
            float(row['cost']) if row['cost'] else 0,
            row['category'],
            row['name'],
            row['brand'],
            float(row['retail_price']) if row['retail_price'] else 0,
            row['department'],
            row['sku'],
            row['distribution_center_id']
        ))

# Commit and preview
conn.commit()
print("Sample data:")
for row in cursor.execute('SELECT * FROM products LIMIT 5'):
    print(row)

conn.close()
