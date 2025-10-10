import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Send,
  Mic,
  Radio,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, TextField } from "@mui/material";

const featuredShows = [
  {
    id: 1,
    title: "Sauti ya Vijana",
    presenter: "DJ Peace",
    listeners: 1280,
    desc: "Amplifying the voices of young Kenyans on issues that matter. A weekly deep dive into politics, culture, and society.",
  },
  {
    id: 2,
    title: "The Civic Duty",
    presenter: "Asha & Brian",
    listeners: 950,
    desc: "Breaking down policies into actionable steps for youth participation. Know your rights, do your part.",
  },
  {
    id: 3,
    title: "Tech for Good",
    presenter: 'Linda "CodeQueen"',
    listeners: 875,
    desc: "Exploring how tech can be leveraged for peacebuilding, transparency, and social good.",
  },
];

const presenters = [
  { id: 1, name: "DJ Peace", votes: 2450 },
  { id: 2, name: "Asha & Brian", votes: 1890 },
  { id: 3, name: 'Linda "CodeQueen"', votes: 1620 },
];

const GenzRadio = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(83);
  const duration = 296;
  const [votes, setVotes] = useState(presenters);

  const [messages, setMessages] = useState([
    { id: 1, user: "Brian", text: "Shoutout to my friends in Kisumu! 🔥" },
    { id: 2, user: "Asha", text: "Loving today’s vibes 🙌" },
    { id: 3, user: "Sam", text: "Please play 'Jerusalema' next!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setProgress((prev) => (prev < duration ? prev + 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleVote = (id) => {
    setVotes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, votes: p.votes + 1 } : p))
    );
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newEntry = { id: Date.now(), user: "You", text: newMessage };
      setMessages((prev) => [...prev, newEntry]);
      setNewMessage("");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12 text-white bg-[#0a0a0a]">
      {/* Header */}
      <div className="text-center space-y-2">
        <Radio className="w-12 h-12 mx-auto text-[#FFD600]" />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#FFD600] via-[#FF4081] to-[#7C4DFF] text-transparent bg-clip-text">
          Gen Z Radio
        </h1>
        <p className="text-[#b0b0b0]">
          Tune in to shows by young presenters, for young audiences. Discussing
          peace, culture, and more.
        </p>
        <p className="font-semibold">
          Listen online or on{" "}
          <span className="text-[#FFD600] font-bold">98.X FM</span>
        </p>
      </div>

      {/* Now Playing */}
      <Card className="bg-gradient-to-r from-[#111111] via-[#1c1c1c] to-[#000000] border border-[#2c2c2c] rounded-xl shadow-xl">
        <CardContent className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#FFD600]">
            <Mic className="animate-pulse" /> NOW PLAYING
          </h2>

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <p className="font-semibold text-white text-xl">
                Sauti ya Vijana
              </p>
              <p className="text-sm text-[#b0b0b0]">with DJ Peace</p>

              {/* Equalizer */}
              <div className="flex items-end h-12 space-x-1 mt-3">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-[#FFD600] rounded"
                    animate={{
                      height: [
                        `${Math.random() * 20 + 10}px`,
                        `${Math.random() * 40 + 20}px`,
                        `${Math.random() * 20 + 10}px`,
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-[#999]">
                  {formatTime(progress)}
                </span>
                <div className="relative w-full h-2 bg-[#2c2c2c] rounded overflow-hidden">
                  <motion.div
                    className="absolute h-2 bg-[#FFD600] rounded"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(progress / duration) * 100}%` }}
                    transition={{ ease: "linear", duration: 0.5 }}
                  />
                </div>
                <span className="text-xs text-[#999]">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause /> : <Play />}
              </Button>
              <Button variant="ghost">
                <SkipBack />
              </Button>
              <Button variant="ghost">
                <SkipForward />
              </Button>
              <Button variant="ghost">
                <Volume2 />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Shows */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-[#FFD600]">
          Featured Shows
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {featuredShows.map((show) => (
            <Card
              key={show.id}
              className="bg-[#111] border border-[#2c2c2c] hover:border-[#FFD600] transition rounded-xl"
            >
              <CardContent className="space-y-2">
                <h3 className="font-semibold text-white">{show.title}</h3>
                <p className="text-sm text-[#b0b0b0]">By {show.presenter}</p>
                <p className="text-sm text-[#d1d1d1]">{show.desc}</p>
                <p className="text-xs text-[#888]">
                  {show.listeners} listeners
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#FFD600] text-[#FFD600] hover:bg-[#FFD600] hover:text-black"
                >
                  Listen
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Voting */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-[#FFD600]">
          Vote for Your Favorite Presenters
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {votes.map((presenter) => (
            <Card
              key={presenter.id}
              className="bg-[#111] border border-[#2c2c2c] rounded-xl"
            >
              <CardContent className="flex flex-col items-center space-y-2">
                <Avatar alt={presenter.name} src="/presenter.jpg" />
                <p className="font-semibold text-white">{presenter.name}</p>
                <p className="text-sm text-[#b0b0b0]">
                  {presenter.votes.toLocaleString()} votes
                </p>
                <Button
                  onClick={() => handleVote(presenter.id)}
                  className="bg-[#FFD600] text-black flex align-middle hover:bg-[#FFEA00]"
                >
                  <Heart className="mr-2 h-4 w-4 my-auto" /> Vote
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Live Chat */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-[#FFD600]">
          🎤 Live Chat & Song Requests
        </h2>
        <Card className="bg-[#111] border border-[#2c2c2c] shadow-md rounded-xl">
          <CardContent className="space-y-4">
            <div className="h-64 overflow-y-auto space-y-2 border border-[#2c2c2c] p-2 rounded-md bg-[#1a1a1a]">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-2 bg-[#2c2c2c] rounded shadow-sm"
                  >
                    <span className="font-semibold text-[#FFD600]">
                      {msg.user}:{" "}
                    </span>
                    <span>{msg.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
              <TextField
                fullWidth
                size="small"
                placeholder="Send a shoutout or request..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{
                  input: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#FFD600" },
                    "&:hover fieldset": { borderColor: "#FFD600" },
                  },
                }}
              />
              <Button
                className="bg-[#FFD600] text-black hover:bg-[#FFEA00]"
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="text-center text-sm text-[#888] pt-8">
        Peace Verse © 2025. A youth-led peacebuilding platform for Kenya.
      </footer>
    </div>
  );
};

export default GenzRadio;
