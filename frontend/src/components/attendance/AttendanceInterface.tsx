import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Step,
  Stepper,
  StepLabel,
  Fade,
  CircularProgress,
} from '@mui/material';
import {
  CameraAlt,
  LocationOn,
  Face,
  CheckCircle,
  Error,
  Refresh,
  Close,
  FlashOn,
  FlashOff,
  CameraFront,
  CameraRear,
} from '@mui/icons-material';
import Webcam from 'react-webcam';
import { brandColors } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';

interface AttendanceInterfaceProps {
  onCheckIn: (faceImage: string, location: { lat: number; lng: number }) => Promise<void>;
  onCheckOut: (faceImage: string, location: { lat: number; lng: number }) => Promise<void>;
  currentStatus: 'CHECKED_IN' | 'CHECKED_OUT' | null;
  loading?: boolean;
}

interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
}

const AttendanceInterface: React.FC<AttendanceInterfaceProps> = ({
  onCheckIn,
  onCheckOut,
  currentStatus,
  loading = false,
}) => {
  const { user } = useAuth();
  const webcamRef = useRef<Webcam>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [processing, setProcessing] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const steps = ['Verify Location', 'Capture Face', 'Processing'];
  const isCheckedIn = currentStatus === 'CHECKED_IN';

  const getCurrentLocation = useCallback((): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new globalThis.Error('Geolocation is not supported by this browser'));
        return;
      }

      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          resolve(locationData);
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          reject(new globalThis.Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setFaceDetected(true); // Simulated face detection
      return imageSrc;
    }
    return null;
  }, []);

  const handleStartAttendance = async () => {
    setIsDialogOpen(true);
    setCurrentStep(0);
    setCapturedImage(null);
    setFaceDetected(false);
    setProcessing(false);

    try {
      // Step 1: Get location
      const locationData = await getCurrentLocation();
      setLocation(locationData);
      setCurrentStep(1);
    } catch (error: any) {
      setLocationError(error.message);
    }
  };

  const handleCapture = () => {
    const image = capturePhoto();
    if (image) {
      setCurrentStep(2);
      setProcessing(true);
      
      // Simulate processing delay
      setTimeout(async () => {
        try {
          if (location) {
            if (isCheckedIn) {
              await onCheckOut(image, location);
            } else {
              await onCheckIn(image, location);
            }
          }
          setProcessing(false);
          setIsDialogOpen(false);
        } catch (error) {
          setProcessing(false);
          // Error handling would be done by parent component
        }
      }, 2000);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    setFaceDetected(false);
    setCurrentStep(1);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentStep(0);
    setCapturedImage(null);
    setLocation(null);
    setLocationError(null);
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: facingMode,
  };

  return (
    <>
      <Card 
        sx={{ 
          background: `linear-gradient(135deg, ${brandColors.primary[50]} 0%, ${brandColors.primary[100]} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${brandColors.primary[500]} 0%, ${brandColors.primary[600]} 100%)`,
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                background: `linear-gradient(135deg, ${brandColors.primary[500]} 0%, ${brandColors.primary[600]} 100%)`,
              }}
            >
              <CameraAlt sx={{ fontSize: 40 }} />
            </Avatar>
            
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {isCheckedIn ? 'Check Out' : 'Check In'}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {isCheckedIn 
                ? 'Complete your work day with facial recognition verification'
                : 'Start your work day with facial recognition verification'
              }
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Chip
                label={isCheckedIn ? 'Currently Checked In' : 'Ready to Check In'}
                color={isCheckedIn ? 'success' : 'default'}
                icon={isCheckedIn ? <CheckCircle /> : <CameraAlt />}
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={handleStartAttendance}
              disabled={loading}
              startIcon={<CameraAlt />}
              sx={{
                minWidth: 200,
                height: 48,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${brandColors.primary[500]} 0%, ${brandColors.primary[600]} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${brandColors.primary[600]} 0%, ${brandColors.primary[700]} 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                },
                '&:disabled': {
                  background: brandColors.secondary[200],
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : `${isCheckedIn ? 'Check Out' : 'Check In'} Now`}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Attendance Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minHeight: 600,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isCheckedIn ? 'Check Out Process' : 'Check In Process'}
          </Typography>
          <IconButton onClick={handleCloseDialog} disabled={processing}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {/* Stepper */}
          <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Box sx={{ minHeight: 400 }}>
            {/* Step 1: Location Verification */}
            {currentStep === 0 && (
              <Fade in={true}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: 'info.main' }}>
                    <LocationOn sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Verifying Your Location
                  </Typography>
                  {locationError ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {locationError}
                      <Button onClick={() => getCurrentLocation()} sx={{ ml: 2 }}>
                        Retry
                      </Button>
                    </Alert>
                  ) : (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Please ensure you are at the office location
                      </Typography>
                      <CircularProgress />
                    </Box>
                  )}
                </Box>
              </Fade>
            )}

            {/* Step 2: Face Capture */}
            {currentStep === 1 && (
              <Fade in={true}>
                <Box>
                  {!capturedImage ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ mb: 3 }}>
                        Position Your Face in the Frame
                      </Typography>
                      
                      <Paper
                        sx={{
                          position: 'relative',
                          display: 'inline-block',
                          borderRadius: 3,
                          overflow: 'hidden',
                          border: `3px solid ${faceDetected ? brandColors.primary[500] : brandColors.secondary[300]}`,
                          transition: 'border-color 0.3s ease',
                        }}
                      >
                        <Webcam
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          videoConstraints={videoConstraints}
                          style={{ display: 'block', width: '100%', height: 'auto' }}
                        />
                        
                        {/* Face Detection Overlay */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 200,
                            height: 200,
                            border: `2px dashed ${faceDetected ? brandColors.primary[500] : brandColors.secondary[400]}`,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <Face 
                            sx={{ 
                              fontSize: 40, 
                              color: faceDetected ? brandColors.primary[500] : brandColors.secondary[400],
                              opacity: 0.7 
                            }} 
                          />
                        </Box>
                      </Paper>

                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}>
                          {facingMode === 'user' ? <CameraFront /> : <CameraRear />}
                        </IconButton>
                      </Box>

                      <Button
                        variant="contained"
                        onClick={handleCapture}
                        disabled={!faceDetected}
                        startIcon={<CameraAlt />}
                        sx={{ mt: 3, minWidth: 150 }}
                      >
                        Capture Photo
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ mb: 3 }}>
                        Review Your Photo
                      </Typography>
                      
                      <Paper sx={{ display: 'inline-block', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
                        <img
                          src={capturedImage}
                          alt="Captured face"
                          style={{ width: '100%', maxWidth: 400, height: 'auto', display: 'block' }}
                        />
                      </Paper>

                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={handleRetakePhoto}
                          startIcon={<Refresh />}
                        >
                          Retake
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleCapture}
                          startIcon={<CheckCircle />}
                        >
                          Confirm
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Fade>
            )}

            {/* Step 3: Processing */}
            {currentStep === 2 && (
              <Fade in={true}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: 'success.main' }}>
                    <CheckCircle sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Processing Your {isCheckedIn ? 'Check Out' : 'Check In'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Verifying facial recognition and updating attendance records...
                  </Typography>
                  <CircularProgress size={48} />
                </Box>
              </Fade>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttendanceInterface;