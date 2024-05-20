import openai
from retrying import retry
import sqlite3


def setup_database():
    con = sqlite3.connect('api_config.db')
    cur = con.cursor()

    # Create the api_keys table if it doesn't exist
    cur.execute("""
        CREATE TABLE IF NOT EXISTS api_keys (
            id INTEGER PRIMARY KEY,
            openai_api TEXT,
            pexels_api TEXT
        )
    """)

    con.commit()
    con.close()


def get_api_keys():
    try:
        setup_database()  # Set up the database before attempting to fetch keys

        con = sqlite3.connect('api_config.db')
        cur = con.cursor()
        cur.execute("SELECT openai_api, pexels_api FROM api_keys WHERE id = 1")
        api_keys = cur.fetchone()
        con.close()
        if api_keys:
            return {"openai_api": api_keys[0], "pexels_api": api_keys[1]}
    except sqlite3.OperationalError:
        return None

api_keys = get_api_keys()

if api_keys:
    openai.api_key = api_keys["openai_api"]
    Pexels_API_KEY = api_keys["pexels_api"]

else:
    openai.api_key = ""
    Pexels_API_KEY = ""
    print("API keys not found in the database.")
openaii = openai.api_key

def retry_if_exception(exception):
    """Return True if we should retry (in this case when there's an Exception), False otherwise"""
    return isinstance(exception, Exception)

@retry(retry_on_exception=retry_if_exception, stop_max_attempt_number=7)
def openAI_output(self):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "user",
                 "content": self },
            ],
            frequency_penalty=0.2,
            presence_penalty=0.2
        )
        output = response.choices[0]["message"]["content"].strip()
        return output
    except Exception as e:
        print("An error occurred. Retrying...")
        raise e