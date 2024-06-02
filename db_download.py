import sqlite3
import pandas as pd

def export_to_excel(db_name, excel_file):
    conn = sqlite3.connect(db_name)
    
    # Join the sites and links tables
    query = '''
    SELECT 
        s.sitename, 
        s.username, 
        s.app_password, 
        l.url
    FROM sites s
    LEFT JOIN links l ON s.site_id = l.site_id
    '''
    combined_df = pd.read_sql_query(query, conn)
    
    # Rename the columns to match the specified headings
    combined_df.columns = ['Sitename', 'Username', 'Application_Password', 'Added_Link']
    
    # Write to an Excel file
    with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
        combined_df.to_excel(writer, sheet_name='Sites_Links', index=False)
    
    conn.close()
    print(f"Data exported successfully to {excel_file}")

if __name__ == '__main__':    
    # Export the data to an Excel file
    export_to_excel('sites_data.db', 'sites_data.xlsx')
