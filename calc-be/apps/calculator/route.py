from fastapi import APIRouter
import base64
from io import BytesIO
from apps.calculator.utils import analyze_image
from schema import ImageData
from PIL import Image

router = APIRouter()

@router.post('/process')
async def run(data: ImageData):
    try:
        print("Received image data and variables:", data.dict_of_vars)
        image_data = base64.b64decode(data.image.split(',')[1])
        image_bytes = BytesIO(image_data)
        image = Image.open(image_bytes)
        print("Image successfully decoded and opened")
        
        responses = analyze_image(image, dict_of_vars=data.dict_of_vars)
        print("Analysis complete, responses:", responses)
        
        return {
            "message": "Image Processor",
            "type": "success",
            "data": responses,
        }
    except Exception as e:
        print(f"Error in route: {str(e)}")
        return {
            "message": "Error processing image",
            "type": "error",
            "data": [{"expr": "Error", "result": str(e), "assign": False}],
        }
