'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { ScanLine } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  isProcessing: boolean;
}

export default function QRScanner({ onScanSuccess, isProcessing }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [hasCameras, setHasCameras] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = 'qr-reader';

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          if (!mounted) return;
          
          scannerRef.current = new Html5Qrcode(readerElementId, {
            verbose: false,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
          });
          
          await scannerRef.current.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0
            },
            (decodedText) => {
              if (!isProcessing) {
                // Pause scanning briefly after success
                if (scannerRef.current?.isScanning) {
                  scannerRef.current.pause();
                  setTimeout(() => {
                    if (mounted && scannerRef.current?.isScanning) {
                      scannerRef.current.resume();
                    }
                  }, 3000);
                }
                onScanSuccess(decodedText);
              }
            },
            (errorMessage) => {
              // Ignore regular scan failures (when no QR code is in frame)
            }
          );
        } else {
          setHasCameras(false);
          setError('No cameras found on this device.');
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to start camera. Please ensure camera permissions are granted.');
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScanSuccess, isProcessing]);

  if (!hasCameras || error) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-dark-200 rounded-2xl border border-white/5 p-6 text-center">
        <ScanLine className="w-12 h-12 text-zinc-500 mb-4" />
        <p className="text-red-400 font-medium mb-2">Camera Error</p>
        <p className="text-sm text-zinc-400 max-w-xs">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-3xl bg-black border-2 border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
      <div id={readerElementId} className="w-full" />
      
      {/* Decorative scanner lines */}
      <div className="absolute inset-0 pointer-events-none z-10 border-4 border-black/50">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold" />
      </div>
    </div>
  );
}
