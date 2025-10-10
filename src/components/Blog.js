// src/components/About.js
import React from "react";
import { motion } from "framer-motion";
import { Users, Globe2, Target } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <motion.h1
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Us – Team Ubantu
        </motion.h1>

        {/* Intro */}
        <motion.p
          className="text-lg text-center text-gray-300 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          At <span className="font-semibold text-gray-100">Team Ubantu</span>,
          we believe in the power of technology, collaboration, and community to
          drive meaningful change. We are the creative minds behind{" "}
          <span className="font-semibold text-yellow-400">Amani360.org</span>, a
          platform designed to harness digital solutions for peace, dialogue,
          and civic engagement.
        </motion.p>

        {/* Cards Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Journey */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-md rounded-2xl bg-gray-800 border border-gray-700">
              <CardContent className="p-6 text-center">
                <Users className="w-10 h-10 mx-auto text-yellow-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Our Journey</h2>
                <p className="text-gray-400 text-sm">
                  We began at the{" "}
                  <span className="font-medium">
                    1st Code For Democracy Tech Hackathon
                  </span>{" "}
                  at YMCA Nairobi. Now, we are gearing up for the{" "}
                  <span className="font-medium">
                    Global Hackathon in December
                  </span>{" "}
                  to scale our solutions for greater impact.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Inspiration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="shadow-md rounded-2xl bg-gray-800 border border-gray-700">
              <CardContent className="p-6 text-center">
                <Globe2 className="w-10 h-10 mx-auto text-yellow-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Our Inspiration</h2>
                <p className="text-gray-400 text-sm">
                  Proudly facilitated by{" "}
                  <span className="font-medium text-gray-100">
                    Nuru Trust Network
                  </span>
                  , a beacon of hope and innovation driving sustainable
                  development across Africa, empowering us to step boldly into
                  civic innovation.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="shadow-md rounded-2xl bg-gray-800 border border-gray-700">
              <CardContent className="p-6 text-center">
                <Target className="w-10 h-10 mx-auto text-yellow-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
                <p className="text-gray-400 text-sm">
                  We aim to build a digital ecosystem where young people can
                  foster{" "}
                  <span className="font-medium">
                    dialogue, justice, and collaboration
                  </span>
                  . A movement that recognizes the power of youth and the
                  potential of technology for lasting peace.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Closing Note */}
        <motion.p
          className="text-center text-gray-300 mt-12 text-lg font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Join us on this journey. Together, let’s build systems that unite
          rather than divide.
        </motion.p>
      </div>
    </div>
  );
};

export default Blog;
