from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....services.battery_manager import BatteryManager
from ....schemas.battery import (
    BatteryStateResponse,
    BatteryControlCommand,
    BatteryHealthMetrics,
    BatteryOptimalOperation
)

router = APIRouter()
battery_manager = BatteryManager()

@router.get("/{device_id}/state", response_model=BatteryStateResponse)
def get_battery_state(
    device_id: str,
    db: Session = Depends(get_db)
):
    """
    Get current battery state and health metrics
    """
    try:
        return battery_manager.get_battery_state(device_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{device_id}/state", response_model=BatteryStateResponse)
def update_battery_state(
    device_id: str,
    state_data: Dict,
    db: Session = Depends(get_db)
):
    """
    Update battery state with new measurements
    """
    try:
        return battery_manager.update_battery_state(device_id, state_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{device_id}/health", response_model=BatteryHealthMetrics)
def get_battery_health(
    device_id: str,
    db: Session = Depends(get_db)
):
    """
    Get battery health metrics
    """
    try:
        state = battery_manager.get_battery_state(device_id)
        return state["health_metrics"]
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{device_id}/optimal-operation", response_model=BatteryOptimalOperation)
def get_optimal_operation(
    device_id: str,
    horizon_hours: int = Query(24, ge=1, le=168),
    db: Session = Depends(get_db)
):
    """
    Get optimal battery operation schedule
    """
    try:
        return battery_manager.get_optimal_operation(device_id, horizon_hours)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{device_id}/control", response_model=Dict)
def control_battery(
    device_id: str,
    command: BatteryControlCommand,
    db: Session = Depends(get_db)
):
    """
    Apply control command to battery
    """
    try:
        return battery_manager.apply_control_command(device_id, command.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 