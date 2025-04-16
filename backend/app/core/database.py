from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS
import os
from dotenv import load_dotenv

load_dotenv()

# PostgreSQL Configuration
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
POSTGRES_SERVER = os.getenv("POSTGRES_SERVER", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "gridwise")

SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# InfluxDB Configuration
INFLUXDB_URL = os.getenv("INFLUXDB_URL", "http://localhost:8086")
INFLUXDB_TOKEN = os.getenv("INFLUXDB_TOKEN", "your-token")
INFLUXDB_ORG = os.getenv("INFLUXDB_ORG", "gridwise")
INFLUXDB_BUCKET = os.getenv("INFLUXDB_BUCKET", "energy_data")

influxdb_client = InfluxDBClient(
    url=INFLUXDB_URL,
    token=INFLUXDB_TOKEN,
    org=INFLUXDB_ORG
)

write_api = influxdb_client.write_api(write_options=SYNCHRONOUS)
query_api = influxdb_client.query_api()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to write time series data to InfluxDB
def write_time_series_data(measurement, tags, fields, timestamp=None):
    """
    Write time series data to InfluxDB
    
    Args:
        measurement (str): The measurement name
        tags (dict): Tags for the data point
        fields (dict): Fields/values for the data point
        timestamp (int, optional): Timestamp in nanoseconds. Defaults to None.
    """
    try:
        write_api.write(
            bucket=INFLUXDB_BUCKET,
            org=INFLUXDB_ORG,
            record={
                "measurement": measurement,
                "tags": tags,
                "fields": fields,
                "time": timestamp
            }
        )
        return True
    except Exception as e:
        print(f"Error writing to InfluxDB: {e}")
        return False

# Function to query time series data from InfluxDB
def query_time_series_data(query):
    """
    Query time series data from InfluxDB
    
    Args:
        query (str): Flux query string
    
    Returns:
        list: List of tables with query results
    """
    try:
        result = query_api.query(query=query, org=INFLUXDB_ORG)
        return result
    except Exception as e:
        print(f"Error querying InfluxDB: {e}")
        return [] 