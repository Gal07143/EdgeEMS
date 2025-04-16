from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....services.optimization import EnergyOptimizer
from ....schemas.optimization import (
    OptimizationRequest,
    OptimizationResponse,
    BatteryOperationSchedule,
    ROICalculation
)

router = APIRouter()
optimizer = EnergyOptimizer()

@router.post("/battery", response_model=BatteryOperationSchedule)
def optimize_battery_operation(
    request: OptimizationRequest,
    db: Session = Depends(get_db)
):
    """
    Optimize battery operation schedule
    """
    try:
        return optimizer.optimize_battery_operation(
            device_id=request.device_id,
            forecast_horizon_hours=request.horizon_hours,
            tariff_id=request.tariff_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/roi", response_model=ROICalculation)
def calculate_roi(
    request: OptimizationRequest,
    db: Session = Depends(get_db)
):
    """
    Calculate return on investment for battery operation
    """
    try:
        return optimizer.calculate_roi(
            device_id=request.device_id,
            forecast_horizon_hours=request.horizon_hours,
            tariff_id=request.tariff_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tariffs", response_model=List[Dict])
def get_available_tariffs(
    db: Session = Depends(get_db)
):
    """
    Get available electricity tariffs
    """
    try:
        return optimizer.get_available_tariffs()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 