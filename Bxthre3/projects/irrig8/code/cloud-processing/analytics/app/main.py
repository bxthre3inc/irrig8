
from fastapi import FastAPI, HTTPException, Query
from typing import List, Optional
from app.model_stubs import predict_yield, predict_moisture_trend, predict_7_14_day_forecast
import uvicorn

app = FastAPI(
    title="FarmSense Analytics Service",
    description="Agricultural Analytics Microservice",
    version="1.0.0"
)

@app.get("/predict/yield/{field_id}")
async def get_yield_prediction(field_id: str):
    """Predict crop yield for a specific field"""
    try:
        prediction = predict_yield(field_id)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predict/moisture-trend")
async def get_moisture_trend(field_id: str):
    """Predict moisture trend for the next 48 hours for a field"""
    # In a real app, we'd fetch actual sensor history here
    # Mock sensor history
    mock_history = [
        {"moisture": 0.25}, {"moisture": 0.24}, {"moisture": 0.23}
    ]
    try:
        trends = predict_moisture_trend(mock_history)
        return {
            "field_id": field_id,
            "trends": trends
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predict/forecast/{field_id}")
async def get_14_day_forecast(field_id: str):
    """Predict 14-day forecast for a field"""
    try:
        return predict_7_14_day_forecast(field_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "service": "analytics-prediction"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
