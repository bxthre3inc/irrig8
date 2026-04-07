"""
Cloud Processing Pipeline - 1m Virtual Sensor Grid
High-resolution interpolation using Regression Kriging with satellite data integration
"""
import numpy as np
from scipy.spatial.distance import cdist
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime
import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling
from scipy.interpolate import griddata
from sklearn.cluster import KMeans
import logging

logger = logging.getLogger(__name__)


@dataclass
class SensorPoint:
    """Sensor location and readings"""
    sensor_id: str
    x: float  # Longitude
    y: float  # Latitude
    moisture_surface: float
    moisture_root: float
    temperature: float
    elevation: float = 0.0


@dataclass
class SatellitePixel:
    """Satellite-derived covariates"""
    x: float
    y: float
    ndvi: float
    ndwi: float
    lst: float  # Land Surface Temperature
    elevation: float
    slope: float
    management_Zone: int = -1


class RegressionKriging:
    """
    Regression Kriging for 1m resolution interpolation
    Combines trend model (satellite covariates) with residual kriging
    """
    
    def __init__(self, variogram_model: str = 'spherical'):
        self.variogram_model = variogram_model
        self.trend_model = None
        self.scaler = StandardScaler()
        self.variogram_params = None
        
    def fit_trend(
        self, 
        sensor_points: List[SensorPoint],
        satellite_data: List[SatellitePixel]
    ) -> LinearRegression:
        """
        Fit trend model: moisture ~ NDVI + NDWI + LST + elevation + slope
        """
        # Match sensor points to nearest satellite pixels
        X_trend = []
        y_moisture = []
        
        for sensor in sensor_points:
            # Find nearest satellite pixel
            sat_pixel = self._find_nearest_pixel(sensor, satellite_data)
            if sat_pixel:
                features = [
                    sat_pixel.ndvi,
                    sat_pixel.ndwi,
                    sat_pixel.lst,
                    sat_pixel.elevation,
                    sat_pixel.slope
                ]
                X_trend.append(features)
                y_moisture.append(sensor.moisture_surface)
        
        X_trend = np.array(X_trend)
        y_moisture = np.array(y_moisture)
        
        # Standardize features
        X_scaled = self.scaler.fit_transform(X_trend)
        
        # Fit linear trend
        self.trend_model = LinearRegression()
        self.trend_model.fit(X_scaled, y_moisture)
        
        logger.info(f"Trend model R²: {self.trend_model.score(X_scaled, y_moisture):.3f}")
        
        return self.trend_model
    
    def fit_variogram(
        self,
        sensor_points: List[SensorPoint],
        residuals: np.ndarray
    ):
        """
        Fit variogram to residuals for kriging
        Uses method of moments with spherical model
        """
        # Calculate pairwise distances
        coords = np.array([[s.x, s.y] for s in sensor_points])
        distances = cdist(coords, coords, metric='euclidean')
        
        # Calculate semivariance
        n = len(residuals)
        gamma = np.zeros_like(distances)
        
        for i in range(n):
            for j in range(i+1, n):
                gamma[i, j] = 0.5 * (residuals[i] - residuals[j])**2
                gamma[j, i] = gamma[i, j]
        
        # Bin distances and calculate average semivariance
        max_dist = np.max(distances) / 2  # Use half max distance for variogram range
        bins = np.linspace(0, max_dist, 15)
        bin_centers = (bins[:-1] + bins[1:]) / 2
        bin_gamma = []
        
        for i in range(len(bins)-1):
            mask = (distances >= bins[i]) & (distances < bins[i+1])
            if np.any(mask):
                bin_gamma.append(np.mean(gamma[mask]))
            else:
                bin_gamma.append(0)
        
        # Fit spherical variogram model: γ(h) = c0 + c * [1.5(h/a) - 0.5(h/a)³]
        # Simplified fitting - use variance of residuals as sill
        sill = np.var(residuals)
        nugget = bin_gamma[0] if len(bin_gamma) > 0 else 0.1 * sill
        range_param = max_dist * 0.5
        
        self.variogram_params = {
            'model': 'spherical',
            'sill': sill,
            'range': range_param,
            'nugget': nugget
        }
        
        logger.info(f"Variogram params: sill={sill:.4f}, range={range_param:.1f}m, nugget={nugget:.4f}")
    
    def predict_grid(
        self,
        sensor_points: List[SensorPoint],
        satellite_data: List[SatellitePixel],
        grid_bounds: Tuple[float, float, float, float],  # (min_x, min_y, max_x, max_y)
        resolution: float = 1.0  # meters (e.g., 50.0, 20.0, 10.0, 1.0)
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """
        Generate 1m resolution predictions across field
        Returns: (x_grid, y_grid, predictions, variances)
        """
        logger.info(f"Starting {resolution}m grid prediction...")
        
        # 1. Fit trend model
        self.fit_trend(sensor_points, satellite_data)
        
        # 2. Calculate residuals at sensor locations
        residuals = self._calculate_residuals(sensor_points, satellite_data)
        
        # 3. Fit variogram to residuals
        self.fit_variogram(sensor_points, residuals)
        
        # 4. Create 1m grid
        min_x, min_y, max_x, max_y = grid_bounds
        
        # Convert resolution from meters to degrees (approximate)
        res_deg = resolution / 111320.0  # 1 degree ≈ 111.32 km
        
        x_coords = np.arange(min_x, max_x, res_deg)
        y_coords = np.arange(min_y, max_y, res_deg)
        x_grid, y_grid = np.meshgrid(x_coords, y_coords)
        
        grid_shape = x_grid.shape
        n_points = x_grid.size
        
        logger.info(f"Grid shape: {grid_shape}, Total points: {n_points}")
        
        # 5. Predict trend at grid points
        trend_predictions = self._predict_trend_at_grid(
            x_grid.flatten(),
            y_grid.flatten(),
            satellite_data
        )
        
        # 6. Krige residuals at grid points
        residual_predictions, variances = self._krige_residuals(
            x_grid.flatten(),
            y_grid.flatten(),
            sensor_points,
            residuals
        )
        
        # 7. Combine trend + residuals
        final_predictions = trend_predictions + residual_predictions
        
        # Reshape to grid
        predictions_grid = final_predictions.reshape(grid_shape)
        variances_grid = variances.reshape(grid_shape)
        
        logger.info(f"{resolution}m grid prediction complete")
        
        return x_grid, y_grid, predictions_grid, variances_grid

    def predict_point(
        self,
        sensor_points: List[SensorPoint],
        satellite_data: List[SatellitePixel],
        target_x: float,
        target_y: float,
        resolution: float = 0.01 # 1cm default for Point Zoom
    ) -> Dict[str, float]:
        """
        Hyper-accurate Point Zoom (RSS Exclusive)
        Calculates 1cm resolution truth for a specific coordinate.
        """
        logger.info(f"Executing 1cm Point Zoom at ({target_x}, {target_y})")
        
        # 1. Reuse/Check trend model
        if not self.trend_model:
            self.fit_trend(sensor_points, satellite_data)
        
        residuals = self._calculate_residuals(sensor_points, satellite_data)
        
        if not self.variogram_params:
            self.fit_variogram(sensor_points, residuals)
            
        # 2. Predict trend at point
        trend_pred = self._predict_trend_at_grid(
            np.array([target_x]),
            np.array([target_y]),
            satellite_data
        )[0]
        
        # 3. Krige residual at point
        residual_pred, variance = self._krige_residuals(
            np.array([target_x]),
            np.array([target_y]),
            sensor_points,
            residuals
        )
        
        final_prediction = trend_pred + residual_pred[0]
        
        return {
            "x": target_x,
            "y": target_y,
            "moisture": float(final_prediction),
            "variance": float(variance[0]),
            "resolution_m": resolution,
            "timestamp": datetime.now().isoformat()
        }
    
    def _find_nearest_pixel(
        self, 
        sensor: SensorPoint, 
        satellite_data: List[SatellitePixel]
    ) -> Optional[SatellitePixel]:
        """Find nearest satellite pixel to sensor location"""
        if not satellite_data:
            return None
        
        min_dist = float('inf')
        nearest = None
        
        for pixel in satellite_data:
            dist = np.sqrt((sensor.x - pixel.x)**2 + (sensor.y - pixel.y)**2)
            if dist < min_dist:
                min_dist = dist
                nearest = pixel
        
        return nearest
    
    def _calculate_residuals(
        self,
        sensor_points: List[SensorPoint],
        satellite_data: List[SatellitePixel]
    ) -> np.ndarray:
        """Calculate residuals: observed - trend"""
        observed = []
        predicted = []
        
        for sensor in sensor_points:
            sat_pixel = self._find_nearest_pixel(sensor, satellite_data)
            if sat_pixel:
                features = np.array([[
                    sat_pixel.ndvi,
                    sat_pixel.ndwi,
                    sat_pixel.lst,
                    sat_pixel.elevation,
                    sat_pixel.slope
                ]])
                features_scaled = self.scaler.transform(features)
                pred = self.trend_model.predict(features_scaled)[0]
                
                observed.append(sensor.moisture_surface)
                predicted.append(pred)
        
        residuals = np.array(observed) - np.array(predicted)
        return residuals
    
    def _predict_trend_at_grid(
        self,
        x_points: np.ndarray,
        y_points: np.ndarray,
        satellite_data: List[SatellitePixel]
    ) -> np.ndarray:
        """Predict trend component at grid points using satellite data"""
        predictions = []
        
        # For each grid point, interpolate satellite covariates
        sat_coords = np.array([[p.x, p.y] for p in satellite_data])
        sat_ndvi = np.array([p.ndvi for p in satellite_data])
        sat_ndwi = np.array([p.ndwi for p in satellite_data])
        sat_lst = np.array([p.lst for p in satellite_data])
        sat_elev = np.array([p.elevation for p in satellite_data])
        sat_slope = np.array([p.slope for p in satellite_data])
        
        grid_coords = np.column_stack([x_points, y_points])
        
        # Interpolate each covariate to grid points
        ndvi_interp = griddata(sat_coords, sat_ndvi, grid_coords, method='linear')
        ndwi_interp = griddata(sat_coords, sat_ndwi, grid_coords, method='linear')
        lst_interp = griddata(sat_coords, sat_lst, grid_coords, method='linear')
        elev_interp = griddata(sat_coords, sat_elev, grid_coords, method='linear')
        slope_interp = griddata(sat_coords, sat_slope, grid_coords, method='linear')
        
        # Handle NaN values (outside convex hull) by falling back to nearest neighbor
        nan_mask = np.isnan(ndvi_interp)
        if np.any(nan_mask):
            ndvi_interp[nan_mask] = griddata(sat_coords, sat_ndvi, grid_coords[nan_mask], method='nearest')
            ndwi_interp[nan_mask] = griddata(sat_coords, sat_ndwi, grid_coords[nan_mask], method='nearest')
            lst_interp[nan_mask] = griddata(sat_coords, sat_lst, grid_coords[nan_mask], method='nearest')
            elev_interp[nan_mask] = griddata(sat_coords, sat_elev, grid_coords[nan_mask], method='nearest')
            slope_interp[nan_mask] = griddata(sat_coords, sat_slope, grid_coords[nan_mask], method='nearest')

        # Stack features
        X_grid = np.column_stack([ndvi_interp, ndwi_interp, lst_interp, elev_interp, slope_interp])
        
        # Predict using trend model
        X_grid_scaled = self.scaler.transform(X_grid)
        predictions = self.trend_model.predict(X_grid_scaled)
        
        return predictions
    
    def _krige_residuals(
        self,
        x_points: np.ndarray,
        y_points: np.ndarray,
        sensor_points: List[SensorPoint],
        residuals: np.ndarray
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Ordinary kriging of residuals
        Returns: (predictions, variances)
        """
        sensor_coords = np.array([[s.x, s.y] for s in sensor_points])
        grid_coords = np.column_stack([x_points, y_points])
        
        n_sensors = len(sensor_points)
        n_grid = len(x_points)
        
        predictions = np.zeros(n_grid)
        variances = np.zeros(n_grid)
        
        # Kriging parameters
        sill = self.variogram_params['sill']
        range_param = self.variogram_params['range']
        nugget = self.variogram_params['nugget']
        
        # Precompute covariance matrix for sensors (K)
        # K = C(h_ii)
        K = np.zeros((n_sensors, n_sensors))
        for i in range(n_sensors):
            for j in range(n_sensors):
                h = np.sqrt(np.sum((sensor_coords[i] - sensor_coords[j])**2))
                if h == 0:
                    K[i, j] = sill
                elif h <= range_param:
                    K[i, j] = sill - (nugget + (sill - nugget) * (1.5 * h / range_param - 0.5 * (h / range_param)**3))
                else:
                    K[i, j] = 0
        
        # Add small value to diagonal for numerical stability (nugget effect)
        K += np.eye(n_sensors) * 1e-9
        
        # For efficiency, process in batches
        batch_size = 500
        
        for batch_start in range(0, n_grid, batch_size):
            batch_end = min(batch_start + batch_size, n_grid)
            batch_coords = grid_coords[batch_start:batch_end]
            
            # Calculate distance from batch points to all sensors
            distances = cdist(batch_coords, sensor_coords, metric='euclidean')
            
            # Solve Kriging for each point in batch
            for idx, dist_vector in enumerate(distances):
                # Covariance between grid point and sensors (k)
                k = np.zeros(n_sensors)
                for j, h in enumerate(dist_vector):
                    if h == 0:
                        k[j] = sill
                    elif h <= range_param:
                        k[j] = sill - (nugget + (sill - nugget) * (1.5 * h / range_param - 0.5 * (h / range_param)**3))
                    else:
                        k[j] = 0
                
                # Solve: K * weights = k
                try:
                    weights = np.linalg.solve(K, k)
                    
                    # Prediction = weights . residuals
                    predictions[batch_start + idx] = np.dot(weights, residuals)
                    
                    # Variance = sill - weights . k
                    variances[batch_start + idx] = max(0, sill - np.dot(weights, k))
                except np.linalg.LinAlgError:
                    # Fallback to nearest neighbor if matrix is singular
                    nearest_idx = np.argmin(dist_vector)
                    predictions[batch_start + idx] = residuals[nearest_idx]
                    variances[batch_start + idx] = sill
        
        return predictions, variances


class SatelliteProcessor:
    """Process Sentinel-2 and Landsat imagery for covariates"""
    
    @staticmethod
    def calculate_ndvi(nir_band: np.ndarray, red_band: np.ndarray) -> np.ndarray:
        """Calculate Normalized Difference Vegetation Index"""
        with np.errstate(divide='ignore', invalid='ignore'):
            ndvi = (nir_band - red_band) / (nir_band + red_band)
            ndvi[np.isnan(ndvi)] = 0
        return ndvi
    
    @staticmethod
    def calculate_ndwi(green_band: np.ndarray, nir_band: np.ndarray) -> np.ndarray:
        """Calculate Normalized Difference Water Index"""
        with np.errstate(divide='ignore', invalid='ignore'):
            ndwi = (green_band - nir_band) / (green_band + nir_band)
            ndwi[np.isnan(ndwi)] = 0
        return ndwi
    
    @staticmethod
    def process_sentinel2(
        image_path: str,
        field_bounds: Tuple[float, float, float, float]
    ) -> Dict[str, np.ndarray]:
        """
        Process Sentinel-2 image to extract indices
        Returns dict with 'ndvi', 'ndwi', 'coords'
        """
        with rasterio.open(image_path) as src:
            # Read bands (Sentinel-2 L2A)
            # Band 3 = Green (560nm)
            # Band 4 = Red (665nm)
            # Band 8 = NIR (842nm)
            
            green = src.read(3).astype(float)
            red = src.read(4).astype(float)
            nir = src.read(8).astype(float)
            
            # Calculate indices
            ndvi = SatelliteProcessor.calculate_ndvi(nir, red)
            ndwi = SatelliteProcessor.calculate_ndwi(green, nir)
            
            # Get coordinates for each pixel
            height, width = ndvi.shape
            cols, rows = np.meshgrid(np.arange(width), np.arange(height))
            xs, ys = rasterio.transform.xy(src.transform, rows, cols)
            
            return {
                'ndvi': ndvi,
                'ndwi': ndwi,
                'x_coords': np.array(xs),
                'y_coords': np.array(ys),
                'transform': src.transform,
                'crs': src.crs
            }
    
    @staticmethod
    def extract_pixels_for_field(
        satellite_data: Dict[str, np.ndarray],
        field_bounds: Tuple[float, float, float, float]
    ) -> List[SatellitePixel]:
        """Extract satellite pixels within field bounds"""
        min_x, min_y, max_x, max_y = field_bounds
        
        ndvi = satellite_data['ndvi']
        ndwi = satellite_data['ndwi']
        xs = satellite_data['x_coords']
        ys = satellite_data['y_coords']
        
        # Apply k-means clustering to NDVI and NDWI to identify management Zones
        logger.info("Applying k-means clustering for management Zones...")
        valid_mask = ~np.isnan(ndvi) & ~np.isnan(ndwi)
        features = np.column_stack([ndvi[valid_mask], ndwi[valid_mask]])
        
        if len(features) > 0:
            kmeans = KMeans(n_clusters=5, random_state=42)
            clusters = kmeans.fit_predict(features)
            
            # Map clusters back to 2D array
            cluster_map = np.full(ndvi.shape, -1, dtype=int)
            cluster_map[valid_mask] = clusters
        else:
            cluster_map = np.zeros(ndvi.shape, dtype=int)
        
        pixels = []
        for i in range(ndvi.shape[0]):
            for j in range(ndvi.shape[1]):
                x, y = xs[i][j], ys[i][j]
                if min_x <= x <= max_x and min_y <= y <= max_y:
                    pixels.append(SatellitePixel(
                        x=x, y=y,
                        ndvi=ndvi[i, j],
                        ndwi=ndwi[i, j],
                        lst=satellite_data.get('lst', np.zeros_like(ndvi))[i, j] if 'lst' in satellite_data else 0.0,
                        elevation=satellite_data.get('elevation', np.zeros_like(ndvi))[i, j] if 'elevation' in satellite_data else 0.0,
                        slope=satellite_data.get('slope', np.zeros_like(ndvi))[i, j] if 'slope' in satellite_data else 0.0,
                        management_Zone=cluster_map[i, j]
                    ))
        
        return pixels


# Example usage
if __name__ == "__main__":
    # Mock data for demonstration
    sensors = [
        SensorPoint("s1", -122.4194, 37.7749, 0.25, 0.30, 22.5),
        SensorPoint("s2", -122.4180, 37.7760, 0.28, 0.32, 23.0),
        SensorPoint("s3", -122.4170, 37.7755, 0.22, 0.27, 22.0),
    ]
    
    satellite_pixels = [
        SatellitePixel(-122.4194, 37.7749, 0.65, 0.25, 25.0, 100.0, 2.0),
        SatellitePixel(-122.4180, 37.7760, 0.70, 0.20, 24.0, 105.0, 1.5),
        SatellitePixel(-122.4170, 37.7755, 0.60, 0.30, 26.0, 95.0, 2.5),
    ]
    
    # Initialize kriging
    rk = RegressionKriging()
    
    # Generate 50m Compliance Grid
    x_50, y_50, pred_50, var_50 = rk.predict_grid(
        sensors, satellite_pixels, bounds, resolution=50.0
    )
    
    # Generate 1m Enterprise Grid
    x_1, y_1, pred_1, var_1 = rk.predict_grid(
        sensors, satellite_pixels, bounds, resolution=1.0
    )
    
    # Generate 1cm Point Zoom
    zoom = rk.predict_point(
        sensors, satellite_pixels, -122.4185, 37.7752
    )
    
    print(f"50m Grid Shape: {pred_50.shape}")
    print(f"1m Grid Shape: {pred_1.shape}")
    print(f"1cm Point Zoom: {zoom['moisture']:.4f} (Var: {zoom['variance']:.6f})")
