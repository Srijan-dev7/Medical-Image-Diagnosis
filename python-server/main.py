"""FastAPI entry point for medical-image model inference."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from config.models import LOADED_MODELS, MODEL_DEFINITIONS, load_models, model_metadata
from inference.base import ALLOWED_MODEL_VARIANTS
from inference.bone_fracture import predict_bone_fracture
from inference.brain_tumor import predict_brain_tumor
from inference.pneumonia import predict_pneumonia
from utils.preprocessing import ALLOWED_IMAGE_TYPES


@asynccontextmanager
async def lifespan(_: FastAPI):
    load_models()
    yield
    LOADED_MODELS.clear()


app = FastAPI(
    title="Medical Image Diagnosis API",
    description="Educational and research image-classification API.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/models")
def models() -> dict[str, list[dict[str, object]]]:
    return {"models": [model_metadata(model) for model in MODEL_DEFINITIONS.values()]}


async def read_upload(image: UploadFile, model_variant: str) -> bytes:
    """Apply endpoint-level validation before model-specific preprocessing."""
    if model_variant not in ALLOWED_MODEL_VARIANTS:
        allowed = ", ".join(sorted(ALLOWED_MODEL_VARIANTS))
        raise HTTPException(
            status_code=422,
            detail=f"Invalid model_variant. Use one of: {allowed}.",
        )
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Only JPG, JPEG, and PNG images are supported.",
        )
    return await image.read()


def inference_error(error: Exception) -> HTTPException:
    status_code = 400 if isinstance(error, ValueError) else 500
    return HTTPException(status_code=status_code, detail=str(error))


@app.post("/predict/pneumonia")
async def pneumonia_prediction(
    image: UploadFile = File(...), model_variant: str = Form("best")
) -> dict[str, object]:
    try:
        return predict_pneumonia(model_variant, await read_upload(image, model_variant))
    except Exception as error:
        raise inference_error(error) from error


@app.post("/predict/brain-tumor")
async def brain_tumor_prediction(
    image: UploadFile = File(...), model_variant: str = Form("best")
) -> dict[str, object]:
    try:
        return predict_brain_tumor(model_variant, await read_upload(image, model_variant))
    except Exception as error:
        raise inference_error(error) from error


@app.post("/predict/bone-fracture")
async def bone_fracture_prediction(
    image: UploadFile = File(...), model_variant: str = Form("best")
) -> dict[str, object]:
    try:
        return predict_bone_fracture(model_variant, await read_upload(image, model_variant))
    except Exception as error:
        raise inference_error(error) from error
