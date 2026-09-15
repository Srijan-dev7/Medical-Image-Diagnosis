"""Pneumonia-model inference."""

from inference.base import predict


def predict_pneumonia(model_variant: str, image_bytes: bytes) -> dict[str, object]:
    return predict("pneumonia", model_variant, image_bytes)
