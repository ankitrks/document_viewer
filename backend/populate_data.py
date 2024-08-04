import asyncio
import asyncpg
import os

DATABASE_URL = "postgresql://api_admin:bng321@localhost/viewer"
# DATABASE_URL = os.getenv('DATABASE_URL')

initial_data = [
    {"type": "bank-draft", "title": "Bank Draft", "position": 0},
    {"type": "bill-of-lading", "title": "Bill of Lading", "position": 1},
    {"type": "invoice", "title": "Invoice", "position": 2},
    {"type": "bank-draft-2", "title": "Bank Draft 2", "position": 3},
    {"type": "bill-of-lading-2", "title": "Bill of Lading 2", "position": 4},
]

async def populate_data():
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        for item in initial_data:
            await conn.execute('''
                INSERT INTO documents (type, title, position)
                SELECT $1, $2, $3 WHERE NOT EXISTS (
                    SELECT 1 FROM documents WHERE type = $1
                )
            ''', item['type'], item['title'], item['position'])
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(populate_data())
