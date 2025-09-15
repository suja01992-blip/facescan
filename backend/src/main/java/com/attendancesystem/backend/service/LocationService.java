package com.attendancesystem.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

    private static final Logger logger = LoggerFactory.getLogger(LocationService.class);
    
    @Value("${app.allowed-location.latitude}")
    private double allowedLatitude;
    
    @Value("${app.allowed-location.longitude}")
    private double allowedLongitude;
    
    @Value("${app.location-tolerance}")
    private double locationTolerance;

    /**
     * Verify if the provided location is within allowed range of the office
     */
    public boolean isLocationValid(double latitude, double longitude) {
        try {
            if (latitude == 0.0 && longitude == 0.0) {
                logger.warn("Invalid GPS coordinates received: 0.0, 0.0");
                return false;
            }

            double distance = calculateDistance(latitude, longitude, allowedLatitude, allowedLongitude);
            boolean isValid = distance <= locationTolerance;
            
            logger.info("Location validation - Distance: {} km, Tolerance: {} km, Valid: {}", 
                       distance, locationTolerance, isValid);
            
            return isValid;
        } catch (Exception e) {
            logger.error("Error validating location: " + e.getMessage());
            return false;
        }
    }

    /**
     * Calculate distance between two GPS coordinates using Haversine formula
     */
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371; // Earth's radius in kilometers

        // Convert latitude and longitude from degrees to radians
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        // Convert latitudes to radians
        double rLat1 = Math.toRadians(lat1);
        double rLat2 = Math.toRadians(lat2);

        // Apply Haversine formula
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(rLat1) * Math.cos(rLat2) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c; // Distance in kilometers
    }

    /**
     * Get the allowed office location
     */
    public LocationInfo getAllowedLocation() {
        return new LocationInfo(allowedLatitude, allowedLongitude, locationTolerance);
    }

    /**
     * Validate location with custom tolerance
     */
    public boolean isLocationValid(double latitude, double longitude, double customTolerance) {
        try {
            if (latitude == 0.0 && longitude == 0.0) {
                return false;
            }

            double distance = calculateDistance(latitude, longitude, allowedLatitude, allowedLongitude);
            return distance <= customTolerance;
        } catch (Exception e) {
            logger.error("Error validating location with custom tolerance: " + e.getMessage());
            return false;
        }
    }

    /**
     * Get distance from office location
     */
    public double getDistanceFromOffice(double latitude, double longitude) {
        return calculateDistance(latitude, longitude, allowedLatitude, allowedLongitude);
    }

    /**
     * Check if GPS coordinates are reasonable (basic validation)
     */
    public boolean areCoordinatesValid(double latitude, double longitude) {
        return latitude >= -90 && latitude <= 90 && 
               longitude >= -180 && longitude <= 180 &&
               !(latitude == 0.0 && longitude == 0.0);
    }

    /**
     * Location information class
     */
    public static class LocationInfo {
        private final double latitude;
        private final double longitude;
        private final double tolerance;

        public LocationInfo(double latitude, double longitude, double tolerance) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.tolerance = tolerance;
        }

        public double getLatitude() {
            return latitude;
        }

        public double getLongitude() {
            return longitude;
        }

        public double getTolerance() {
            return tolerance;
        }
    }
}