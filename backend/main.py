from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from .api import biosample, comment, operator, sampletype
from .database import init_db
from .services.exceptions import EntityNotFoundError  # la tua eccezione personalizzata

app = FastAPI()

# CORS Middleware come già hai fatto
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# Handler globale per EntityNotFoundError
@app.exception_handler(EntityNotFoundError)
async def entity_not_found_exception_handler(request: Request, exc: EntityNotFoundError):
    return JSONResponse(
        status_code=404,
        content={"detail": str(exc)},
    )

# Router
app.include_router(biosample.router)
app.include_router(comment.router)
app.include_router(operator.router)
app.include_router(sampletype.router)
