# Plan: Medical Image Diagnosis REST API

**TL;DR**: Build a FastAPI-based REST API with separate endpoints for each disease diagnosis (pneumonia, brain tumor, bone fracture). Each endpoint accepts image uploads, runs inference with dual model variants (scratch vs. library approaches), returns predictions with confidence scores, and persists results to a prediction history database. The API supports both single and batch predictions, exports results, and serves pre-computed statistics.

## Steps

### Phase 1: Project Structure & Dependencies
1. Update `requirements.txt` with all dependencies (FastAPI, Uvicorn, TensorFlow, Pillow, SQLAlchemy, pydantic, python-multipart)
2. Create modular folder structure:
   - `src/models/` — model loading utilities
   - `src/inference/` — inference logic per disease
   - `src/database/` — prediction history ORM models
   - `src/routes/` — FastAPI endpoint definitions
   - `src/schemas/` — Pydantic request/response models
   - `logs/` — prediction history and audit logs

### Phase 2: Core Inference Engine (*parallel with Phase 1*)
3. Create `src/inference/base.py` — Abstract base class for inference
   - Common: image loading, preprocessing, confidence extraction
4. Create `src/inference/pneumonia.py` — Pneumonia model wrapper
   - Loads both EfficientNet variants (library & scratch)
   - Routes to selected variant based on query param (default: library)
   - Returns: {prediction: "NORMAL"|"PNEUMONIA", confidence: float, model_variant: str}
5. Create `src/inference/brain_tumor.py` — Brain tumor model wrapper
   - Loads both DenseNet121 variants
   - Returns: {prediction: "glioma"|"meningioma"|"notumor"|"pituitary", confidence: float, model_variant: str}
6. Create `src/inference/bone_fracture.py` — Bone fracture model wrapper
   - Loads both variants (when available)
   - Returns: {prediction: "fractured"|"not_fractured", confidence: float, model_variant: str}

### Phase 3: Database & History
7. Create `src/database/models.py` — SQLAlchemy ORM
   - `Prediction` table: id, disease_type, image_filename, prediction, confidence, model_variant, timestamp, user_id (nullable)
8. Create `src/database/crud.py` — CRUD operations
   - Save prediction, retrieve history (filtered by disease/date/model), export to CSV
9. Initialize SQLite database (`predictions.db`) in project root

### Phase 4: API Endpoints (*depends on Phase 2 & 3*)
10. Create `src/schemas/schemas.py` — Pydantic models
    - `PredictionRequest`: {image: UploadFile, model_variant: "library"|"scratch"}
    - `PredictionResponse`: {disease_type, prediction, confidence, model_variant, timestamp, id}
11. Create `src/routes/pneumonia.py`
    - POST `/pneumonia/predict` — single image prediction
    - POST `/pneumonia/batch-predict` — multiple images
    - GET `/pneumonia/history` — prediction history (query: limit, date_from, date_to)
    - GET `/pneumonia/stats` — accuracy/confidence stats grouped by model_variant
12. Create `src/routes/brain_tumor.py` — same endpoints as pneumonia
13. Create `src/routes/bone_fracture.py` — same endpoints as pneumonia
14. Create `src/routes/export.py`
    - POST `/export/predictions` — export history to CSV (query: disease, date_range, model_variant)

### Phase 5: Main Application (*depends on Phase 4*)
15. Create main FastAPI app in `app.py`
    - Initialize FastAPI instance
    - Register all route blueprints
    - Add middleware for logging, CORS
    - Add health check endpoint: GET `/health`
    - Add endpoint to list available models: GET `/models`

### Phase 6: Testing & Documentation (*depends on Phase 5*)
16. Create `tests/` folder with test cases:
    - Test each endpoint with mock images
    - Test batch predictions
    - Test history retrieval and filtering
    - Test export functionality
17. Auto-generated OpenAPI docs at `/docs` (FastAPI default)

## Relevant files
- `app.py` — Entry point for FastAPI server
- `requirements.txt` — Dependencies list
- `src/inference/base.py` — Base inference class with common preprocessing logic
- `src/inference/pneumonia.py`, `brain_tumor.py`, `bone_fracture.py` — Disease-specific wrappers
- `src/database/models.py` — `Prediction` SQLAlchemy model with fields: id (PK), disease_type, image_filename, prediction, confidence, model_variant, timestamp
- `src/database/crud.py` — Functions: `save_prediction()`, `get_history()`, `export_to_csv()`
- `src/routes/pneumonia.py`, `brain_tumor.py`, `bone_fracture.py` — Endpoints for each disease
- `src/routes/export.py` — Export endpoint
- `src/schemas/schemas.py` — `PredictionRequest`, `PredictionResponse` Pydantic models

## Verification
1. **Startup test**: Run `python -m uvicorn app:app --reload` — server starts on localhost:8000 ✓
2. **Endpoint test**: Call each disease endpoint with a test image → returns prediction with confidence ✓
3. **History test**: POST 3 predictions, GET `/history` → returns all 3 with correct timestamps ✓
4. **Batch test**: Upload 5 images to `/batch-predict` → processes all, returns array of predictions ✓
5. **Export test**: Call `/export/predictions` → CSV file downloads with all history ✓
6. **Stats test**: Call `/stats` → returns min/max/avg confidence per model_variant ✓
7. **OpenAPI docs**: Visit `/docs` → interactive API documentation loads ✓

## Decisions
- **FastAPI over Flask**: FastAPI has built-in async support, auto-generated OpenAPI docs, and better validation with Pydantic
- **SQLite**: Lightweight, no external database needed; upgradable to PostgreSQL later
- **Dual model variants**: Kept both for clinical vs. experimental use as you mentioned (cheap/fast library vs. slower/accurate scratch)
- **Separate disease endpoints**: Cleaner design than single endpoint with conditional logic; scales easily if you add more diseases
- **Image upload via multipart**: Standard REST pattern; supports both single and batch
- **CSV export**: Simple format for clinical records and Excel integration

## Further Considerations
1. **Authentication**: Plan includes optional `user_id` field in database. Later add JWT tokens to `/predict` endpoints if this is a multi-user clinical system?
2. **Model storage**: Currently assumes `.keras` files in `models/` folder. Should we add model versioning (e.g., `models/pneumonia_v1.keras`, `models/pneumonia_v2.keras`) for tracking model lineage?
3. **Confidence thresholds**: Should the API flag predictions below a confidence threshold (e.g., <70%) for manual review, or just return raw scores?