import { useRef, useEffect, useState } from "react";

export type CornerPoint = {
  x: number;
  y: number;
};

export type DetectionResult = {
  boundingBox: DOMRectReadOnly;
  cornerPoints: CornerPoint[];
  format: string;
  rawValue: string;
};

export function useBarcodeDetectionFormats() {
  const [formats, setFormats] = useState<string[]>();

  useEffect(() => {
    const abortController = new AbortController();
    BarcodeDetector.getSupportedFormats().then((formats: string[]) => {
      if (abortController.signal.aborted) return;
      setFormats(formats);
    });

    return () => {
      abortController.abort();
    };
  }, []);

  return formats;
}

export default function useOnBarcodeDetect(
  mediaStream: MediaStream | null,
  callback: (result: DetectionResult[]) => void
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!mediaStream) return;

    let raf: number;

    const barcodeDetector = new BarcodeDetector();
    const track = mediaStream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);

    (async function runDetectionLoop() {
      const frame = await imageCapture.grabFrame();
      const detectionResult = await barcodeDetector.detect(frame);
      if (detectionResult.length) {
        callbackRef.current(detectionResult);
      }
      await new Promise((resolve) => setTimeout(resolve, 200));

      raf = requestAnimationFrame(runDetectionLoop);
    })();

    return () => {
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [mediaStream]);
}
