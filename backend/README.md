# Document Viewer Backend

## Setup

1. Clone the repository
2. Create a virtual environment: `python3 -m venv venv`
3. Activate the virtual environment: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Create postgres database: `create role api_admin with password bng321 LOGIN CREATEDB` & `create databse viewer owner api_admin`
6. To populate data in database: `python populate_data`
7. Run the application: `python main.py` OR `uvicorn app:app --reload`
8. The API will be available at `http://localhost:8080`
