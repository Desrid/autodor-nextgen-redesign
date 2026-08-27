"use client";

import { useEffect, useRef, useState } from "react";

import { Icon } from "@/app/components/icons";

const VIDEO_SOURCE = "/media/about-video.mp4";

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function AboutVideo() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const controlsTimerRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const revealControls = () => {
    setControlsVisible(true);
    if (controlsTimerRef.current) window.clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = window.setTimeout(() => setControlsVisible(false), 2400);
  };

  useEffect(
    () => () => {
      if (controlsTimerRef.current) window.clearTimeout(controlsTimerRef.current);
    },
    [],
  );

  const open = () => {
    const dialog = dialogRef.current;
    const video = playerRef.current;
    if (!dialog || !video) return;
    dialog.showModal();
    revealControls();
    void video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const close = () => {
    const dialog = dialogRef.current;
    const video = playerRef.current;
    video?.pause();
    setIsPlaying(false);
    if (dialog?.open) dialog.close();
  };

  const togglePlayback = () => {
    const video = playerRef.current;
    if (!video) return;
    if (video.paused) void video.play().then(() => setIsPlaying(true));
    else {
      video.pause();
      setIsPlaying(false);
    }
    revealControls();
  };

  const toggleMuted = () => {
    const video = playerRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    revealControls();
  };

  return (
    <section className="about-video" aria-label="Видео о дорожной инфраструктуре">
      <button
        className="about-video__preview"
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label="Открыть видео"
      >
        <video
          className="about-video__preview-media"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={VIDEO_SOURCE} type="video/mp4" />
        </video>
        <span className="about-video__preview-scrim" aria-hidden="true" />
        <span className="about-video__play" aria-hidden="true">
          <Icon name="play" size={24} />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="about-video__dialog"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onMouseMove={revealControls}
        aria-label="Видеоплеер"
      >
        <div className="about-video__player">
          <video
            ref={playerRef}
            className="about-video__media"
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          >
            <source src={VIDEO_SOURCE} type="video/mp4" />
          </video>
          <button
            className="about-video__close"
            type="button"
            onClick={close}
            aria-label="Закрыть видео"
          >
            <Icon name="close" size={24} />
          </button>
          <div
            className={`about-video__controls${controlsVisible ? " is-visible" : ""}`}
          >
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={
                isPlaying ? "Поставить видео на паузу" : "Воспроизвести видео"
              }
            >
              <Icon name={isPlaying ? "pause" : "play"} size={24} />
            </button>
            <span className="about-video__time" aria-live="off">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={Math.min(currentTime, duration || 0)}
              step="0.1"
              aria-label="Перемотка видео"
              onChange={(event) => {
                const video = playerRef.current;
                const nextTime = Number(event.target.value);
                if (video) video.currentTime = nextTime;
                setCurrentTime(nextTime);
                revealControls();
              }}
            />
            <button
              type="button"
              onClick={toggleMuted}
              aria-label={isMuted ? "Включить звук" : "Выключить звук"}
            >
              <Icon name={isMuted ? "volumeMuted" : "volume"} size={24} />
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
