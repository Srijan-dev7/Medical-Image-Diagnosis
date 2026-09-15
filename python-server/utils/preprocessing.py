"""Image validation and the preprocessing verified from each training notebook."""

from __future__ import annotations

from io import BytesIO

import numpy as np
from PIL import Image, UnidentifiedImageError
from tensorflow.keras.applications.densenet import preprocess_input as densenet_preprocess

from config.models import ModelDefinition


MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png"}


def prepare_image(image_bytes: bytes, definition: ModelDefinition) -> np.ndarray:
    """Validate, convert, resize, and preprocess an image for one specific model."""
    if not image_bytes:
        raise ValueError("No image data was received.")
    if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise ValueError("The image is larger than the 10 MB limit.")

    try:
        with Image.open(BytesIO(image_bytes)) as opened_image:
            image = opened_image.copy()
    except (UnidentifiedImageError, OSError) as error:
        raise ValueError("The uploaded file is not a valid JPG or PNG image.") from error

    mode = "L" if definition.channels == 1 else "RGB"
    image = image.convert(mode)
    image = image.resize(definition.input_size, Image.Resampling.LANCZOS)
    pixels = np.asarray(image, dtype=np.float32)

    if definition.channels == 1:
        pixels = np.expand_dims(pixels, axis=-1)

    # The original DenseNet121 notebook used this exact Keras preprocessing.
    if definition.key == "brain_tumor_transfer_learning":
        pixels = densenet_preprocess(pixels)
    # These five notebooks trained their model inputs after rescaling by 1 / 255.
    elif definition.key != "pneumonia_transfer_learning":
        pixels /= 255.0
    # The EfficientNet notebook deliberately had no external ImageDataGenerator
    # rescaling. Its saved EfficientNetB0 model includes the needed preprocessing.

    return np.expand_dims(pixels, axis=0)
