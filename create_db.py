import sqlite3

def init_db():
    conn = sqlite3.connect('sites_data.db')
    cursor = conn.cursor()

    # Create the 'sites' table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sites (
            site_id INTEGER PRIMARY KEY AUTOINCREMENT,
            sitename TEXT NOT NULL,
            username TEXT NOT NULL,
            app_password TEXT NOT NULL
        )
    ''')

    # Create the 'links' table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS links (
            link_id INTEGER PRIMARY KEY AUTOINCREMENT,
            site_id INTEGER,
            url TEXT NOT NULL,
            FOREIGN KEY (site_id) REFERENCES sites(site_id)
        )
    ''')

    # Commit the changes and close the connection
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()  # Initialize the database
    print("Database initialized successfully.")
