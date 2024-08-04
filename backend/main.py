import os
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
import databases
import sqlalchemy
from pydantic import BaseModel
import uvicorn

DATABASE_URL = "postgresql://api_admin:bng321@localhost/viewer"
# DATABASE_URL = os.getenv('DATABASE_URL')

database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

documents = sqlalchemy.Table(
    "documents",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("type", sqlalchemy.String),
    sqlalchemy.Column("title", sqlalchemy.String),
    sqlalchemy.Column("position", sqlalchemy.Integer),
)

engine = sqlalchemy.create_engine(DATABASE_URL)
metadata.create_all(engine)

class DocumentIn(BaseModel):
    type: str
    title: str
    position: int

class DocumentOut(DocumentIn):
    id: int

async def get_documents(request):
    query = documents.select().order_by(documents.c.position)
    results = await database.fetch_all(query)
    return JSONResponse([dict(result) for result in results])

async def create_document(request):
    document = await request.json()
    query = documents.insert().values(**document)
    last_record_id = await database.execute(query)
    return JSONResponse({**document, "id": last_record_id})

async def update_document(request):
    document = await request.json()
    query = documents.update().where(documents.c.id == document["id"]).values(**document)
    await database.execute(query)
    return JSONResponse(document)

app = Starlette(
    debug=True,
    routes=[
        Route("/documents", get_documents, methods=["GET"]),
        Route("/documents", create_document, methods=["POST"]),
        Route("/documents/{id:int}", update_document, methods=["PUT"]),
    ],
    on_startup=[database.connect],
    on_shutdown=[database.disconnect],
    middleware=[Middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])]
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
