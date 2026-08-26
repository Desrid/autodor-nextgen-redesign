"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SOURCE = "/media/about-video.mp4";

function PlayIcon({ paused }: Readonly<{ paused: boolean }>) {
  return paused ? <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m8 5 11 7-11 7V5Z" /></svg> : <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 5h3v14H7V5Zm7 0h3v14h-3V5Z" /></svg>;
}

function VolumeIcon({ muted }: Readonly<{ muted: boolean }>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24">{muted ? <><path d="M4 10h4l5-4v12l-5-4H4v-4Z" /><path d="m17 9 4 6m0-6-4 6" /></> : <><path d="M4 10h4l5-4v12l-5-4H4v-4Z" /><path d="M17 9.5a4 4 0 0 1 0 5M19.5 7a7.5 7.5 0 0 1 0 10" /></>}</svg>;
}

function CloseIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
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

  useEffect(() => () => {
    if (controlsTimerRef.current) window.clearTimeout(controlsTimerRef.current);
  }, []);

  const open = () => {
    const dialog = dialogRef.current;
    const video = playerRef.current;
    if (!dialog || !video) return;
    dialog.showModal();
    revealControls();
    void video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
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

  return <section className="about-video" aria-label="Видео о дорожной инфраструктуре">
    <button className="about-video__preview" type="button" onClick={open} aria-haspopup="dialog" aria-label="Открыть видео">
      <video className="about-video__preview-media" autoPlay loop muted playsInline preload="auto">
        <source src={VIDEO_SOURCE} type="video/mp4" />
      </video>
      <span className="about-video__preview-scrim" aria-hidden="true" />
      <span className="about-video__play" aria-hidden="true"><PlayIcon paused /></span>
    </button>

    <dialog ref={dialogRef} className="about-video__dialog" onCancel={(event) => { event.preventDefault(); close(); }} onMouseMove={revealControls} aria-label="Видеоплеер">
      <div className="about-video__player">
        <video ref={playerRef} className="about-video__media" playsInline preload="metadata" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}>
          <source src={VIDEO_SOURCE} type="video/mp4" />
        </video>
        <button className="about-video__close" type="button" onClick={close} aria-label="Закрыть видео"><CloseIcon /></button>
        <div className={`about-video__controls${controlsVisible ? " is-visible" : ""}`}>
          <button type="button" onClick={togglePlayback} aria-label={isPlaying ? "Поставить видео на паузу" : "Воспроизвести видео"}><PlayIcon paused={!isPlaying} /></button>
          <span className="about-video__time" aria-live="off">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <input type="range" min="0" max={duration || 0} value={Math.min(currentTime, duration || 0)} step="0.1" aria-label="Перемотка видео" onChange={(event) => { const video = playerRef.current; const nextTime = Number(event.target.value); if (video) video.currentTime = nextTime; setCurrentTime(nextTime); revealControls(); }} />
          <button type="button" onClick={toggleMuted} aria-label={isMuted ? "Включить звук" : "Выключить звук"}><VolumeIcon muted={isMuted} /></button>
        </div>
      </div>
    </dialog>
  </section>;
}
