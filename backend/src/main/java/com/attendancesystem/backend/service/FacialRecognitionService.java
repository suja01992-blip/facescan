package com.attendancesystem.backend.service;

import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.opencv.objdetect.CascadeClassifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Base64;
import java.util.List;

@Service
public class FacialRecognitionService {

    private static final Logger logger = LoggerFactory.getLogger(FacialRecognitionService.class);
    
    private CascadeClassifier faceDetector;

    @PostConstruct
    public void init() {
        try {
            // Load OpenCV native library
            nu.pattern.OpenCV.loadShared();
            
            // Initialize face detector with Haar cascade
            // Note: In production, you would load this from resources
            faceDetector = new CascadeClassifier();
            
            logger.info("OpenCV and face detector initialized successfully");
        } catch (Exception e) {
            logger.error("Failed to initialize OpenCV: " + e.getMessage());
        }
    }

    /**
     * Extract face encoding from base64 image
     * This is a simplified implementation - in production you'd use a proper face recognition library
     */
    public String extractFaceEncoding(String base64Image) {
        try {
            if (base64Image == null || base64Image.isEmpty()) {
                throw new RuntimeException("Image data is empty");
            }

            // Remove data URL prefix if present
            if (base64Image.startsWith("data:image")) {
                base64Image = base64Image.substring(base64Image.indexOf(",") + 1);
            }

            // Decode base64 image
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);
            
            // Convert to OpenCV Mat
            Mat imageMat = Imgcodecs.imdecode(new MatOfByte(imageBytes), Imgcodecs.IMREAD_COLOR);
            
            if (imageMat.empty()) {
                throw new RuntimeException("Failed to decode image");
            }

            // Convert to grayscale for face detection
            Mat grayMat = new Mat();
            Imgproc.cvtColor(imageMat, grayMat, Imgproc.COLOR_BGR2GRAY);

            // Detect faces
            MatOfRect faces = new MatOfRect();
            if (faceDetector != null) {
                faceDetector.detectMultiScale(grayMat, faces);
            }

            Rect[] faceArray = faces.toArray();
            if (faceArray.length == 0) {
                throw new RuntimeException("No face detected in the image");
            }

            if (faceArray.length > 1) {
                throw new RuntimeException("Multiple faces detected. Please ensure only one face is visible");
            }

            // Extract face region
            Rect faceRect = faceArray[0];
            Mat faceRegion = new Mat(grayMat, faceRect);

            // Resize face to standard size
            Mat resizedFace = new Mat();
            Size targetSize = new Size(100, 100);
            Imgproc.resize(faceRegion, resizedFace, targetSize);

            // Generate simple face encoding (in production, use proper face recognition algorithms)
            String faceEncoding = generateSimpleFaceEncoding(resizedFace);

            // Cleanup
            imageMat.release();
            grayMat.release();
            faceRegion.release();
            resizedFace.release();

            return faceEncoding;

        } catch (Exception e) {
            logger.error("Face encoding extraction failed: " + e.getMessage());
            throw new RuntimeException("Face recognition failed: " + e.getMessage());
        }
    }

    /**
     * Compare two face encodings to determine if they match
     */
    public boolean compareFaces(String encoding1, String encoding2) {
        try {
            if (encoding1 == null || encoding2 == null) {
                return false;
            }

            if (encoding1.equals(encoding2)) {
                return true;
            }

            // For production, implement proper face comparison algorithm
            // This is a simplified implementation
            return calculateSimilarity(encoding1, encoding2) > 0.8; // 80% similarity threshold

        } catch (Exception e) {
            logger.error("Face comparison failed: " + e.getMessage());
            return false;
        }
    }

    /**
     * Verify if the provided image matches the stored face encoding
     */
    public boolean verifyFace(String base64Image, String storedEncoding) {
        try {
            String extractedEncoding = extractFaceEncoding(base64Image);
            return compareFaces(extractedEncoding, storedEncoding);
        } catch (Exception e) {
            logger.error("Face verification failed: " + e.getMessage());
            return false;
        }
    }

    /**
     * Generate a simple face encoding from face image matrix
     * In production, use proper face recognition algorithms like FaceNet, dlib, etc.
     */
    private String generateSimpleFaceEncoding(Mat faceImage) {
        // This is a very simplified approach - just for demonstration
        // In production, you'd use proper face recognition algorithms
        
        StringBuilder encoding = new StringBuilder();
        
        // Sample some pixels as a simple "encoding"
        for (int i = 10; i < faceImage.rows() - 10; i += 10) {
            for (int j = 10; j < faceImage.cols() - 10; j += 10) {
                double[] pixel = faceImage.get(i, j);
                if (pixel != null && pixel.length > 0) {
                    encoding.append(String.format("%.2f,", pixel[0]));
                }
            }
        }
        
        return encoding.toString();
    }

    /**
     * Calculate similarity between two face encodings
     */
    private double calculateSimilarity(String encoding1, String encoding2) {
        // Simplified similarity calculation
        // In production, use proper distance metrics
        
        String[] values1 = encoding1.split(",");
        String[] values2 = encoding2.split(",");
        
        if (values1.length != values2.length) {
            return 0.0;
        }
        
        double similarity = 0.0;
        int count = 0;
        
        for (int i = 0; i < Math.min(values1.length, values2.length); i++) {
            try {
                double v1 = Double.parseDouble(values1[i]);
                double v2 = Double.parseDouble(values2[i]);
                
                // Simple similarity based on difference
                double diff = Math.abs(v1 - v2);
                similarity += Math.max(0, 1.0 - (diff / 255.0));
                count++;
            } catch (NumberFormatException e) {
                // Skip invalid values
            }
        }
        
        return count > 0 ? similarity / count : 0.0;
    }

    /**
     * Check if face detection is available
     */
    public boolean isFaceDetectionAvailable() {
        return faceDetector != null && !faceDetector.empty();
    }
}