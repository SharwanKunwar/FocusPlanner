import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Slider } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";

function TimeTracker({ onTimeUpdate }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // 🎵 Audio
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);

  // 🎵 Songs from public folder
  const songs = [
    { name: "Music 01", url: "/musicList/music01.mp3" },
    { name: "Music 02", url: "/musicList/music02.mp3" },
    { name: "Music 03", url: "/musicList/music03.mp3" },
  ];

  // Set default song
  useEffect(() => {
    setCurrentSong(songs[0]);
  }, []);

  // ⏱ Timer
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 10;
          if (onTimeUpdate) onTimeUpdate(newTime);
          return newTime;
        });
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  // 🎵 Controls
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleSeek = (value) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (value / 100) * audio.duration;
    }
    setProgress(value);
  };

  const changeSong = (song) => {
    setCurrentSong(song);
    setProgress(0);
    setIsPlaying(false);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = song.url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 0);
  };

  // ⏱ Format time
  const formatTime = (ms) => {
    if (typeof ms !== "number" || isNaN(ms)) return "00:00:00:00";
    const hrs = String(Math.floor(ms / 3600000)).padStart(2, "0");
    const mins = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
    const secs = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const millis = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${hrs}:${mins}:${secs}:${millis}`;
  };

  return (
    <div className="mt-0 px-3 flex flex-col gap-3 items-center">

      {/* ⏱ Timer */}
      <div className="flex justify-center items-center mastShadow !bg-gradient-to-br from-indigo-400 to-pink-400 w-full h-[29vh] border-black/30 border rounded-lg">
        <div className="text-6xl text-white">
          {formatTime(time)}
        </div>
      </div>

      {/* ⏱ Controls */}
      <section className="w-full flex gap-5">
        <Button
          className="w-full"
          onClick={() => setIsRunning((prev) => !prev)}
        >
          {isRunning ? "Stop Timer" : "Start Timer"}
        </Button>

        <Button
          className="w-full"
          onClick={() => {
            setIsRunning(false);
            setTime(0);
            if (onTimeUpdate) onTimeUpdate(0);
          }}
        >
          Reset
        </Button>
      </section>

      {/* 🎵 Buttons */}
      <section className="w-full flex gap-5">
        <Button
          className="w-full"
          onClick={() => setIsMusicOpen(true)}
        >
          Play Music
        </Button>

        <Button
          className="w-full"
          onClick={() => setIsAiOpen(true)}
        >
          Open Draw
        </Button>
      </section>

      {/* 🎵 Music Modal */}
      <Modal
        open={isMusicOpen}
        footer={null}
        onCancel={() => {
          setIsMusicOpen(false);
          if (audioRef.current) audioRef.current.pause();
          setIsPlaying(false);
        }}
        width="97vw"
        style={{ top: "5vh" }}
        bodyStyle={{ height: "78vh", padding: "20px" }}
        centered
      >
        <div className="w-full h-full flex">

          {/* 🎧 Player */}
          <div className="w-[50%] flex flex-col items-center justify-center gap-6">
            
            {currentSong && (
              <audio
                ref={audioRef}
                src={currentSong.url}
                onTimeUpdate={handleTimeUpdate}
              />
            )}

            <div className="text-xl font-semibold">
              {currentSong?.name}
            </div>

            <Slider
              value={progress}
              onChange={handleSeek}
              style={{ width: "70%" }}
            />

            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={togglePlay}
            />
          </div>

          {/* 🎵 Playlist */}
          <div className="w-[50%] overflow-y-auto p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Playlist</h2>

            {songs.map((song, index) => (
              <div
                key={index}
                onClick={() => changeSong(song)}
                className={`p-3 mb-2 rounded cursor-pointer ${
                  currentSong?.url === song.url
                    ? "bg-indigo-400 text-white"
                    : "bg-white hover:bg-gray-200"
                }`}
              >
                {song.name}
              </div>
            ))}
          </div>

        </div>
      </Modal>

      {/* 🎨 Draw Modal */}
      <Modal
        open={isAiOpen}
        footer={null}
        onCancel={() => setIsAiOpen(false)}
        width="97vw"
        style={{ top: "5vh" }}
        bodyStyle={{ height: "78vh", padding: "20px" }}
        centered
      >
        <iframe
          src="https://excalidraw.com/"
          className="w-full h-full"
        ></iframe>
      </Modal>

    </div>
  );
}

export default TimeTracker;