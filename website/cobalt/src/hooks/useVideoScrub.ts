import { useEffect, useRef } from 'react';

/** Scrubs a <video>'s currentTime to match 0→1 scroll progress. Never autoplays. */
export function useVideoScrub(videoRef: React.RefObject<HTMLVideoElement | null>, progress: number) {
  const ready = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    const onLoadedMetadata = () => {
      ready.current = true;
      video.currentTime = 0.0001;
      // Safari refuses to paint a seeked frame until it has decoded one via play().
      video.muted = true;
      const playAttempt = video.play();
      if (playAttempt) {
        playAttempt
          .then(() => video.pause())
          .catch(() => {
            /* autoplay blocked — currentTime scrubbing still works on non-Safari */
          });
      }
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    if (video.readyState >= 1) onLoadedMetadata();

    return () => video.removeEventListener('loadedmetadata', onLoadedMetadata);
  }, [videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ready.current || !video.duration || Number.isNaN(video.duration)) return;
    const target = progress * video.duration;
    if (Math.abs(video.currentTime - target) > 0.016) {
      video.currentTime = target;
    }
  }, [progress, videoRef]);
}
