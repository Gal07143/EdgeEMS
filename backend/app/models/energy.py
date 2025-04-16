from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..core.database import Base

class EnergySourceType(enum.Enum):
    GRID = "grid"
    SOLAR = "solar"
    WIND = "wind"
    BATTERY = "battery"
    GENERATOR = "generator"
    OTHER = "other"

class EnergyDirection(enum.Enum):
    IMPORT = "import"
    EXPORT = "export"
    CONSUMPTION = "consumption"
    PRODUCTION = "production"

class EnergyMeasurement(Base):
    __tablename__ = "energy_measurements"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    source_type = Column(Enum(EnergySourceType), nullable=False)
    direction = Column(Enum(EnergyDirection), nullable=False)
    power_kw = Column(Float, nullable=False)  # Instantaneous power in kilowatts
    energy_kwh = Column(Float, nullable=False)  # Cumulative energy in kilowatt-hours
    voltage_v = Column(Float, nullable=True)  # Voltage in volts
    current_a = Column(Float, nullable=True)  # Current in amperes
    frequency_hz = Column(Float, nullable=True)  # Frequency in hertz
    power_factor = Column(Float, nullable=True)  # Power factor
    metadata = Column(JSON, nullable=True)  # Additional measurement metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    device = relationship("Device", back_populates="energy_measurements")

class BatteryState(Base):
    __tablename__ = "battery_states"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    state_of_charge = Column(Float, nullable=False)  # Percentage (0-100)
    state_of_health = Column(Float, nullable=True)  # Percentage (0-100)
    temperature_c = Column(Float, nullable=True)  # Temperature in Celsius
    voltage_v = Column(Float, nullable=True)  # Battery voltage in volts
    current_a = Column(Float, nullable=True)  # Battery current in amperes
    power_kw = Column(Float, nullable=True)  # Battery power in kilowatts
    cycle_count = Column(Integer, nullable=True)  # Number of charge/discharge cycles
    remaining_capacity_kwh = Column(Float, nullable=True)  # Remaining capacity in kilowatt-hours
    metadata = Column(JSON, nullable=True)  # Additional battery metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    device = relationship("Device", back_populates="battery_states")

class EnergyTariff(Base):
    __tablename__ = "energy_tariffs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    utility_provider = Column(String, nullable=False)
    rate_type = Column(String, nullable=False)  # fixed, variable, time-of-use, etc.
    base_rate = Column(Float, nullable=False)  # Base rate per kWh
    peak_rate = Column(Float, nullable=True)  # Peak rate per kWh
    off_peak_rate = Column(Float, nullable=True)  # Off-peak rate per kWh
    demand_charge = Column(Float, nullable=True)  # Demand charge per kW
    currency = Column(String, nullable=False, default="USD")
    effective_from = Column(DateTime(timezone=True), nullable=False)
    effective_to = Column(DateTime(timezone=True), nullable=True)
    metadata = Column(JSON, nullable=True)  # Additional tariff metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class EnergyForecast(Base):
    __tablename__ = "energy_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False)
    forecast_type = Column(String, nullable=False)  # consumption, production, price, etc.
    timestamp = Column(DateTime(timezone=True), nullable=False)
    forecast_horizon = Column(Integer, nullable=False)  # Forecast horizon in hours
    values = Column(JSON, nullable=False)  # Forecast values with timestamps
    confidence_intervals = Column(JSON, nullable=True)  # Confidence intervals for the forecast
    model_version = Column(String, nullable=True)  # Version of the forecasting model used
    metadata = Column(JSON, nullable=True)  # Additional forecast metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    device = relationship("Device", back_populates="energy_forecasts") 