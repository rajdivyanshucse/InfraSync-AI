from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import io
from ultralytics import YOLO
import uvicorn

app = FastAPI(title="InfraSync AI Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# YOLO Model Initialization
model = YOLO("yolov8n.pt")

def extract_exif_data(image: Image.Image):
    exif_data = {}
    try:
        info = image._getexif()
        if info:
            for tag, value in info.items():
                decoded = TAGS.get(tag, tag)
                if decoded == "GPSInfo":
                    gps_data = {}
                    for g in value:
                        sub_decoded = GPSTAGS.get(g, g)
                        gps_data[sub_decoded] = value[g]
                    exif_data["GPS"] = gps_data
                else:
                    exif_data[decoded] = str(value)
    except Exception:
        pass
    return exif_data

@app.get("/")
def home():
    return {"status": "Active", "message": "InfraSync AI Microservice Running!"}

@app.post("/verify-site")
async def verify_site_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    # 1. EXIF Metadata Extraction
    exif_metadata = extract_exif_data(image)
    has_gps = "GPS" in exif_metadata

    # 2. YOLO Object Detection
    results = model(image)
    detected_objects = []
    for box in results[0].boxes:
        cls_id = int(box.cls[0])
        detected_objects.append(model.names[cls_id])

    return {
        "status": "Success",
        "exif_verification": {
            "metadata_found": True if exif_metadata else False,
            "has_gps_coordinates": has_gps
        },
        "ai_vision_analysis": {
            "detected_elements": list(set(detected_objects)),
            "is_verified": True if len(detected_objects) > 0 else False
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)