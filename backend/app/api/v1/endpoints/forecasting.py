from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....services.forecasting import EnergyForecaster
from ....schemas.forecasting import (
    ForecastRequest,
    ConsumptionForecast,
    ProductionForecast,
    WeatherData
)

router = APIRouter()
forecaster = EnergyForecaster()

@router.post("/consumption", response_model=ConsumptionForecast)
def forecast_consumption(
    request: ForecastRequest,
    db: Session = Depends(get_db)
):
    """
    Forecast energy consumption for a device
    """
    try:
        return forecaster.forecast_consumption(
            device_id=request.device_id,
            horizon_hours=request.horizon_hours
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/production", response_model=ProductionForecast)
def forecast_production(
    request: ForecastRequest,
    db: Session = Depends(get_db)
):
    """
    Forecast energy production for a device
    """
    try:
        return forecaster.forecast_production(
            device_id=request.device_id,
            horizon_hours=request.horizon_hours
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/weather/{location}", response_model=WeatherData)
def get_weather_data(
    location: str,
    db: Session = Depends(get_db)
):
    """
    Get weather data for a location
    """
    try:
        return forecaster._get_weather_data(location)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 