import { useState, useEffect } from "react";

export default function useUserMedia(constraints: MediaStreamConstraints) {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<MediaError | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    (async function getUserMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (abortController.signal.aborted) {
          setMediaStream(stream);
        }
      } catch (error) {
        if (abortController.signal.aborted) {
          setError(error as MediaError);
        }
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [constraints]);

  return {
    mediaStream,
    error,
  };
}
