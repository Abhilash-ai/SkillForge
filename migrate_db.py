import sqlite3

def run_migration():
    conn = sqlite3.connect('backend/skillforge.db')
    cursor = conn.cursor()
    
    columns_to_add = [
        "first_name VARCHAR",
        "last_name VARCHAR",
        "bio TEXT",
        "github_url VARCHAR",
        "linkedin_url VARCHAR"
    ]
    
    for col in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col}")
            print(f"Successfully added column: {col}")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print(f"Column {col.split()[0]} already exists.")
            else:
                print(f"Error adding {col}: {e}")
                
    conn.commit()
    conn.close()

if __name__ == "__main__":
    run_migration()
