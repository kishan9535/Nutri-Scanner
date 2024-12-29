'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { detectBarcode } from '../../utils/barcodeDetector';
import { getProductDetails } from '../../services/productService';
import { Camera, Upload, X, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import ProductDetails from '../../components/ProductDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Webcam from 'react-webcam';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
  };
}

interface ProductDetails {
  product_name: string;
  brands: string;
  image_url: string;
  nutriments: {
    [key: string]: number;
  };
  ingredients_text: string;
  tags?: string[];
}

interface DetectionResult {
  code: string;
  format: string;
}

export default function ScanFood() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [loadingState, setLoadingState] = useState<string>('');
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = () => {
    setIsCameraActive(true);
    setError(null);
  };

  const stopCamera = () => {
    setIsCameraActive(false);
  };

  const toggleZoom = () => {
    setZoomLevel((prevZoom) => (prevZoom === 1 ? 2 : 1));
  };

  const debouncedProcessImage = debounce(processImage, 300);

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        debouncedProcessImage(imageSrc);
      }
    }
  }, [webcamRef]);

  const processImage = async (imageSrc: string) => {
    setIsLoading(true);
    setError(null);
    setBarcode(null);
    setProduct(null);

    try {
      setLoadingState('Detecting barcode...');
      const detectionResult = await detectBarcode(imageSrc);
      setBarcode(detectionResult.code);
      
      setLoadingState('Fetching product details...');
      await fetchProductDetails(detectionResult.code);
    } catch (err: any) {
      setError(err.message || 'Failed to process the image');
    } finally {
      setIsLoading(false);
      setLoadingState('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setCapturedImage(imageSrc);
        processImage(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProductDetails = async (barcode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const productDetails = await getProductDetails(barcode);
      setProduct(productDetails);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching product details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualInput = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const barcodeInput = form.elements.namedItem('barcode') as HTMLInputElement;
    if (barcodeInput && barcodeInput.value) {
      setBarcode(barcodeInput.value);
      await fetchProductDetails(barcodeInput.value);
    }
  };

  const addToDailyIntake = async (product: ProductDetails) => {
    try {
      const foodItem = {
        name: product.product_name,
        calories: product.nutriments['energy-kcal'] || 0,
        protein: product.nutriments.proteins || 0,
        carbs: product.nutriments.carbohydrates || 0,
        fat: product.nutriments.fat || 0,
        imageUrl: product.image_url,
        ingredients: product.ingredients_text,
        tags: product.tags || [],
        time: new Date().toISOString(), // Use current time in ISO format
      };

      const response = await fetch('/api/user/daily-intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to daily intake');
      }

      // Also add to food list
      await fetch('/api/user/food-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodItem),
      });

      console.log('Item added to daily intake and food list');
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add item');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">NutriScan</h1>
        <div>
          {status === "authenticated" && session?.user?.name ? (
            <p className="text-lg font-semibold">Welcome, {session.user.name}</p>
          ) : status === "unauthenticated" && (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => router.push('/login')}>Log In</Button>
              <Button onClick={() => router.push('/register')}>Sign Up</Button>
            </div>
          )}
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Scan Food</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative w-full max-w-md mx-auto">
            {isCameraActive && (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: 'environment',
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                }}
                style={{
                  width: '100%',
                  height: 'auto',
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center',
                }}
              />
            )}
            {!isCameraActive && (
              <div className="w-full max-w-md mx-auto h-[300px] bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Camera is off</p>
              </div>
            )}
            {isCameraActive && (
              <>
                <Button
                  onClick={stopCamera}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white"
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  onClick={toggleZoom}
                  className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-700 text-white"
                  size="icon"
                >
                  {zoomLevel === 1 ? <ZoomIn className="h-4 w-4" /> : <ZoomOut className="h-4 w-4" />}
                </Button>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <Button
              onClick={isCameraActive ? captureImage : startCamera}
              className={`${
                isCameraActive ? 'bg-green-500 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-700'
              } text-white`}
              disabled={isLoading}
            >
              <Camera className="mr-2 h-4 w-4" />
              {isCameraActive ? 'Capture Image' : 'Start Camera'}
            </Button>
            <label className="bg-purple-500 hover:bg-purple-700 text-white rounded-md px-4 py-2 cursor-pointer flex items-center justify-center">
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading}
              />
            </label>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Manual Barcode Entry</h2>
            <form onSubmit={handleManualInput} className="flex items-center space-x-2">
              <Input
                type="text"
                name="barcode"
                placeholder="Enter barcode number"
                className="flex-grow"
              />
              <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white">
                Submit
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center p-4">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <p className="text-xl font-bold">{loadingState || 'Processing...'}</p>
          </CardContent>
        </Card>
      )}

      {capturedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Captured Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img src={capturedImage} alt="Captured" className="max-w-full h-auto mx-auto" />
          </CardContent>
        </Card>
      )}

      {barcode && (
        <Card>
          <CardHeader>
            <CardTitle>Detected Barcode</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{barcode}</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {product && (
        <ProductDetails product={product} onAddToDailyIntake={addToDailyIntake} />
      )}
    </div>
  );
}

