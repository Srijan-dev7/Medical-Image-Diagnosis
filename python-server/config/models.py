"""Model metadata and one-time TensorFlow model loading."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import tensorflow as tf


PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODELS_DIRECTORY = PROJECT_ROOT / "models"


@dataclass(frozen=True)
class ModelDefinition:
    """The verified training and inference details for one saved model."""

    key: str
    disease: str
    name: str
    architecture: str
    variant: str
    filename: str
    input_size: tuple[int, int]
    channels: int
    classes: tuple[str, ...]
    preprocessing: str
    output_activation: str
    accuracy: float
    recommended: bool

    @property
    def path(self) -> Path:
        return MODELS_DIRECTORY / self.filename


MODEL_DEFINITIONS: dict[str, ModelDefinition] = {
    "pneumonia_scratch": ModelDefinition(
        key="pneumonia_scratch",
        disease="pneumonia",
        name="Pneumonia Scratch CNN",
        architecture="Custom CNN",
        variant="scratch",
        filename="pneumonia_scratch.keras",
        input_size=(224, 224),
        channels=3,
        classes=("NORMAL", "PNEUMONIA"),
        preprocessing="RGB, resize to 224x224, then divide pixel values by 255.",
        output_activation="sigmoid",
        accuracy=0.8541666865348816,
        recommended=False,
    ),
    "pneumonia_transfer_learning": ModelDefinition(
        key="pneumonia_transfer_learning",
        disease="pneumonia",
        name="Pneumonia EfficientNetB0",
        architecture="EfficientNetB0",
        variant="transfer_learning",
        filename="pneumonia_efficientnet.keras",
        input_size=(224, 224),
        channels=3,
        classes=("NORMAL", "PNEUMONIA"),
        preprocessing=(
            "RGB, resize to 224x224, with no external rescaling; "
            "the saved EfficientNetB0 model retains its built-in preprocessing."
        ),
        output_activation="sigmoid",
        accuracy=0.8205128312110901,
        recommended=True,
    ),
    "brain_tumor_scratch": ModelDefinition(
        key="brain_tumor_scratch",
        disease="brain_tumor",
        name="Brain Tumor Scratch CNN",
        architecture="Custom CNN",
        variant="scratch",
        filename="brain_tumor_scratch.keras",
        input_size=(224, 224),
        channels=3,
        classes=("glioma", "meningioma", "notumor", "pituitary"),
        preprocessing="RGB, resize to 224x224, then divide pixel values by 255.",
        output_activation="softmax",
        accuracy=0.7693750262260437,
        recommended=False,
    ),
    "brain_tumor_transfer_learning": ModelDefinition(
        key="brain_tumor_transfer_learning",
        disease="brain_tumor",
        name="Brain Tumor DenseNet121",
        architecture="DenseNet121",
        variant="transfer_learning",
        filename="brain_tumor_densenet121.keras",
        input_size=(224, 224),
        channels=3,
        classes=("glioma", "meningioma", "notumor", "pituitary"),
        preprocessing="RGB, resize to 224x224, then apply tensorflow.keras.applications.densenet.preprocess_input.",
        output_activation="softmax",
        accuracy=0.8987500071525574,
        recommended=True,
    ),
    "bone_fracture_scratch": ModelDefinition(
        key="bone_fracture_scratch",
        disease="bone_fracture",
        name="Bone Fracture Scratch CNN",
        architecture="Custom CNN",
        variant="scratch",
        filename="bone_fracture_scratch.keras",
        input_size=(224, 224),
        channels=1,
        classes=("fractured", "not fractured"),
        preprocessing="Grayscale, resize to 224x224, then divide pixel values by 255.",
        output_activation="sigmoid",
        accuracy=0.8939999938011169,
        recommended=False,
    ),
    "bone_fracture_transfer_learning": ModelDefinition(
        key="bone_fracture_transfer_learning",
        disease="bone_fracture",
        name="Bone Fracture MobileNetV2",
        architecture="MobileNetV2",
        variant="transfer_learning",
        filename="bone_fracture_mobilenetv2.keras",
        input_size=(224, 224),
        channels=3,
        classes=("fractured", "not fractured"),
        preprocessing="RGB, resize to 224x224, then divide pixel values by 255.",
        output_activation="sigmoid",
        accuracy=0.9900000095367432,
        recommended=True,
    ),
}

LOADED_MODELS: dict[str, tf.keras.Model] = {}


def load_models() -> None:
    """Load each saved model once, raising an actionable error if one fails."""
    for key, definition in MODEL_DEFINITIONS.items():
        if not definition.path.is_file():
            raise RuntimeError(
                f"Unable to load '{definition.name}': model file was not found at "
                f"'{definition.path}'."
            )

        try:
            LOADED_MODELS[key] = tf.keras.models.load_model(
                definition.path, compile=False
            )
        except Exception as error:
            raise RuntimeError(
                f"Unable to load '{definition.name}' from '{definition.path}': {error}"
            ) from error


def model_metadata(definition: ModelDefinition) -> dict[str, object]:
    """Return safe, frontend-friendly metadata without exposing model objects."""
    return {
        "disease": definition.disease,
        "model_name": definition.name,
        "architecture": definition.architecture,
        "variant": definition.variant,
        "recommended": definition.recommended,
        "input_size": list(definition.input_size),
        "channels": definition.channels,
        "classes": list(definition.classes),
        "preprocessing": definition.preprocessing,
        "output_activation": definition.output_activation,
        "accuracy": definition.accuracy,
        "loaded": definition.key in LOADED_MODELS,
    }
