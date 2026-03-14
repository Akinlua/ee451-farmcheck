import cv2
import numpy as np
import time
import requests
import base64
import threading
from flask import Flask, render_template, Response
from tensorflow.lite.python.interpreter import Interpreter
from picamera2 import Picamera2

app = Flask(__name__)

# --- API SETUP (Exactly from your screenshot) ---
API_URL = "https://ee451-farmcheck.vercel.app/api/scan"
LAST_SCAN_TIME = 0

def send_scan(image_path, disease, confidence):
    """Reads image from disk, encodes it, and sends to the API."""
    try:
        with open(image_path, "rb") as img:
            encoded = base64.b64encode(img.read()).decode("utf-8")
            
        payload = {
            "image": encoded,
            "disease": disease,
            "confidence": float(confidence)
        }
        
        res = requests.post(API_URL, json=payload)
        print("Payload sent! Response:", res.text)
    except Exception as e:
        print(f"API Error: {e}")

# --- 1. SETUP TFLITE AI MODEL ---
print("Loading AI Model...")
interpreter = Interpreter(model_path="poultry_disease_model.tflite")
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
LABELS = ["Healthy", "Coccidiosis", "Newcastle Disease", "Salmonella"]

# --- 2. SETUP CAMERA (Keeping Picamera2 so it doesn't crash) ---
print("Initializing Camera...")
picam2 = Picamera2()
config = picam2.create_video_configuration(main={"format": "BGR888", "size": (640, 480)})
picam2.configure(config)
picam2.start()
print("System Ready!")

def generate_frames():
    global LAST_SCAN_TIME
    
    while True:
        try:
            # Grab frame and fix the colors
            raw_frame = picam2.capture_array()
            frame = cv2.cvtColor(raw_frame, cv2.COLOR_RGB2BGR)
            
            # --- 3. FECES DETECTION ---
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (11, 11), 0)
            _, thresh = cv2.threshold(blurred, 90, 255, cv2.THRESH_BINARY_INV)
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            feces_detected = False
            
            for contour in contours:
                area = cv2.contourArea(contour)
                if 1000 < area < 40000:
                    feces_detected = True
                    x, y, w, h = cv2.boundingRect(contour)
                    
                    pad = 15
                    x1, y1 = max(0, x - pad), max(0, y - pad)
                    x2, y2 = min(frame.shape[1], x + w + pad), min(frame.shape[0], y + h + pad)
                    roi_crop = frame[y1:y2, x1:x2]
                    
                    # --- 4. DISEASE CLASSIFICATION ---
                    if roi_crop.shape[0] > 0 and roi_crop.shape[1] > 0:
                        img = cv2.resize(roi_crop, (224, 224))
                        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                        input_data = np.expand_dims(img, axis=0).astype(np.float32)
                        
                        interpreter.set_tensor(input_details[0]['index'], input_data)
                        interpreter.invoke()
                        output_data = interpreter.get_tensor(output_details[0]['index'])
                        
                        prediction_index = np.argmax(output_data[0])
                        confidence = output_data[0][prediction_index]
                        detected_status = LABELS[prediction_index]
                        
                        # --- 5. SEND TO API (Matching your format) ---
                        current_time = time.time()
                        if confidence > 0.70 and (current_time - LAST_SCAN_TIME) > 5.0:
                            LAST_SCAN_TIME = current_time
                            
                            # Save the image to the disk like your screenshot
                            cv2.imwrite("crop.jpg", frame)
                            
                            # Trigger your exact function
                            threading.Thread(target=send_scan, args=("crop.jpg", detected_status, confidence)).start()
                        
                        # Draw bounding box
                        color = (0, 255, 0) if detected_status == "Healthy" else (0, 0, 255)
                        cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                        text = f"{detected_status} ({confidence*100:.1f}%)"
                        cv2.putText(frame, text, (x, max(20, y - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

            if not feces_detected:
                cv2.putText(frame, "Scanning for feces...", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2)

            # --- 6. VIDEO STREAM OUTPUT ---
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                   
        except Exception as e:
            print(f"Frame Error: {e}")
            time.sleep(0.1)
            continue

# --- FLASK ROUTES ---
@app.route('/')
def index():
    return render_template('index.html')

# Updated route to match your screenshot
@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)