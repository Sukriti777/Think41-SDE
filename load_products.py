import sqlite3
import csv

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
