from typing import Dict, List, Optional
from datetime import datetime, timedelta
import requests
import os
from dotenv import load_dotenv

load_dotenv()

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY")
        self.base_url = "https://api.openweathermap.org/data/2.5"
    
    def get_weather_data(
        self,
        location: str,
        forecast_hours: int = 24
    ) -> Dict:
        """
        Get weather data for a location
        
        Args:
            location: Location name or coordinates
            forecast_hours: Number of hours to forecast
            
        Returns:
            Dictionary containing weather data
        """
        # Get current weather
        current_weather = self._get_current_weather(location)
        
        # Get forecast
        forecast = self._get_forecast(location, forecast_hours)
        
        return {
            "location": location,
            "current": current_weather,
            "forecast": forecast
        }
    
    def _get_current_weather(self, location: str) -> Dict:
        """Get current weather data"""
        url = f"{self.base_url}/weather"
        params = {
            "q": location,
            "appid": self.api_key,
            "units": "metric"
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        return {
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "pressure": data["main"]["pressure"],
            "wind_speed": data["wind"]["speed"],
            "wind_direction": data["wind"].get("deg"),
            "clouds": data["clouds"]["all"],
            "description": data["weather"][0]["description"],
            "timestamp": datetime.fromtimestamp(data["dt"]).isoformat()
        }
    
    def _get_forecast(self, location: str, hours: int) -> List[Dict]:
        """Get weather forecast"""
        url = f"{self.base_url}/forecast"
        params = {
            "q": location,
            "appid": self.api_key,
            "units": "metric"
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        forecast = []
        
        for item in data["list"]:
            timestamp = datetime.fromtimestamp(item["dt"])
            if timestamp > datetime.now() + timedelta(hours=hours):
                break
                
            forecast.append({
                "timestamp": timestamp.isoformat(),
                "temperature": item["main"]["temp"],
                "humidity": item["main"]["humidity"],
                "pressure": item["main"]["pressure"],
                "wind_speed": item["wind"]["speed"],
                "wind_direction": item["wind"].get("deg"),
                "clouds": item["clouds"]["all"],
                "description": item["weather"][0]["description"]
            })
        
        return forecast
    
    def get_solar_radiation(
        self,
        location: str,
        date: Optional[datetime] = None
    ) -> Dict:
        """
        Get solar radiation data for a location
        
        Args:
            location: Location name or coordinates
            date: Date to get data for (default: today)
            
        Returns:
            Dictionary containing solar radiation data
        """
        if date is None:
            date = datetime.now()
            
        url = f"{self.base_url}/solar"
        params = {
            "q": location,
            "appid": self.api_key,
            "date": date.strftime("%Y-%m-%d")
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        return {
            "location": location,
            "date": date.strftime("%Y-%m-%d"),
            "sunrise": datetime.fromtimestamp(data["sys"]["sunrise"]).isoformat(),
            "sunset": datetime.fromtimestamp(data["sys"]["sunset"]).isoformat(),
            "day_length": data["sys"]["day_length"],
            "radiation": {
                "direct": data.get("direct_radiation", 0),
                "diffuse": data.get("diffuse_radiation", 0),
                "total": data.get("total_radiation", 0)
            }
        } 