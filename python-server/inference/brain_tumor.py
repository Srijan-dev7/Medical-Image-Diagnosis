"""Brain-tumor-model inference."""

from inference.base import predict


def predict_brain_tumor(model_variant: str, image_bytes: bytes) -> dict[str, object]:
    return predict("brain_tumor", model_variant, image_bytes)
