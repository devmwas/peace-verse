import React from "react";
import { motion } from "framer-motion";
import { FaHandshake, FaUsers, FaGlobeAfrica } from "react-icons/fa";
import { Button } from "@mui/material";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white sticky top-0 z-50">
        <motion.h1
          className="text-2xl font-bold text-blue-600"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          Amani360
        </motion.h1>
        <nav className="space-x-6 hidden md:block">
          <a href="#about" className="hover:text-blue-600">
            About
          </a>
          <a href="#features" className="hover:text-blue-600">
            Features
          </a>
          <a href="#mission" className="hover:text-blue-600">
            Mission
          </a>
        </nav>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#2563eb", borderRadius: "8px" }}
          >
            Join Us
          </Button>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Youth-led Peacebuilding for a Stronger Democracy
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl max-w-2xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Amani360 empowers citizens with tools for public participation,
          digital dialogue, and community safety to prevent conflict and
          strengthen democracy in Kenya and beyond.
        </motion.p>
        <motion.div
          className="space-x-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Button
            variant="contained"
            size="large"
            style={{
              backgroundColor: "white",
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            style={{ borderColor: "white", color: "white", fontWeight: "bold" }}
          >
            Learn More
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-16 bg-white">
        <h3 className="text-3xl font-bold text-center text-blue-600 mb-12">
          What We Do
        </h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <FaHandshake className="text-5xl text-blue-500 mb-4" />,
              title: "Peacebuilding",
              text: "We foster dialogue and understanding among communities to build lasting peace.",
            },
            {
              icon: <FaUsers className="text-5xl text-indigo-500 mb-4" />,
              title: "Civic Engagement",
              text: "Empowering youth and citizens to participate actively in democratic processes.",
            },
            {
              icon: <FaGlobeAfrica className="text-5xl text-green-500 mb-4" />,
              title: "Digital Safety",
              text: "Providing tools for safe online spaces to prevent misinformation and conflict.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-2xl shadow-md hover:shadow-lg transition bg-white"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              {feature.icon}
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p>{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="px-6 py-16 bg-blue-50">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-blue-600 mb-6">Our Mission</h3>
          <p className="text-lg md:text-xl mb-6">
            Amani360 is not just a project, it’s a movement. We are committed to
            equipping young people with technology-driven solutions to safeguard
            peace, amplify voices, and build resilient communities.
          </p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="contained"
              size="large"
              style={{ backgroundColor: "#2563eb", borderRadius: "8px" }}
            >
              Be Part of the Change
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-gray-300 py-8 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <p>
          © 2025 Amani360 • Youth-led Peacebuilding in Kenya • #CodeForDemocracy
        </p>
      </motion.footer>
    </div>
  );
}

export default App;
