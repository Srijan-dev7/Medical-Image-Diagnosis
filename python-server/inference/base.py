"""Shared prediction selection and result formatting."""

from __future__ import annotations

import numpy as np

from config.models import LOADED_MODELS, MODEL_DEFINITIONS, ModelDefinition
from utils.preprocessing import prepare_image


ALLOWED_MODEL_VARIANTS = {"best", "scratch", "transfer_learning"}


def get_model_definition(disease: str, model_variant: str) -> ModelDefinition:
    """Resolve a frontend selection to one verified saved model."""
    if model_variant not in ALLOWED_MODEL_VARIANTS:
        allowed = ", ".join(sorted(ALLOWED_MODEL_VARIANTS))
        raise ValueError(f"Invalid model_variant '{model_variant}'. Use one of: {allowed}.")

    matching_models = [
        definition
        for definition in MODEL_DEFINITIONS.values()
        if definition.disease == disease
    ]
    if model_variant == "best":
        return next(model for model in matching_models if model.recommended)

    return next(model for model in matching_models if model.variant == model_variant)


def predict(disease: str, model_variant: str, image_bytes: bytes) -> dict[str, object]:
    """Run inference using an already-loaded model and return display-ready metadata."""
    definition = get_model_definition(disease, model_variant)
    model = LOADED_MODELS.get(definition.key)
    if model is None:
        raise RuntimeError(
            f"The '{definition.name}' model is unavailable. "
            "Restart the FastAPI server and check its startup message."
        )

    image = prepare_image(image_bytes, definition)
    probabilities = np.asarray(model.predict(image, verbose=0))

    if definition.output_activation == "sigmoid":
        positive_probability = float(probabilities[0][0])
        class_index = int(positive_probability >= 0.5)
        confidence = positive_probability if class_index == 1 else 1 - positive_probability
    else:
        class_index = int(np.argmax(probabilities[0]))
        confidence = float(probabilities[0][class_index])

    return {
        "success": True,
        "disease": definition.disease,
        "prediction": definition.classes[class_index],
        "confidence": confidence,
        "model_variant": definition.variant,
        "model_name": definition.name,
        "architecture": definition.architecture,
    }
