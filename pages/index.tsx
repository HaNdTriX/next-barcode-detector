import Head from "next/head";
import { useMemo, useState } from "react";
import useUserMedia from "../hooks/use-user-media";
import useOnBarcodeDetect, {
  DetectionResult,
  useBarcodeDetectionFormats,
} from "../hooks/use-on-barcode-detect";
import beep from "../lib/beep";

export default function IndexPage() {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const mediaContraints = useMemo(() => ({ video: true }), []);
  const { mediaStream, error } = useUserMedia(mediaContraints);
  const formats = useBarcodeDetectionFormats();

  useOnBarcodeDetect(mediaStream, ([result]) => {
    console.log("found", result);
    setResult(result);
    beep();
  });

  return (
    <>
      <Head>
        <title>Next.js Barcode Detector</title>
      </Head>

      <h1>Next.js Barcode Detector</h1>

      <p>
        Try to scan one of the following Barcodes:{" "}
        {formats?.map((format) => JSON.stringify(format)).join(", ")}.
      </p>

      {error && (
        <>
          <h2>Error</h2>
          <pre>{error.toString()}</pre>
        </>
      )}

      {result && (
        <>
          <h2>Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </>
      )}

      <h2>Scanner View</h2>
      <video
        autoPlay
        ref={(video) => {
          if (!video) return;
          video.srcObject = mediaStream;
        }}
        height={300}
        width={400}
      />
    </>
  );
}
