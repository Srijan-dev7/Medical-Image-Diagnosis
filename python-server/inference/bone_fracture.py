"""Bone-fracture-model inference."""

from inference.base import predict

def predict_bone_fracture(model_variant: str, image_bytes: bytes) -> dict[str, object]:
    return predict("bone_fracture", model_variant, image_bytes)
