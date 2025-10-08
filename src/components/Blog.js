import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { Users, Globe, Handshake, Star } from "lucide-react";

const attendees = [
  {
    name: "Prof. Luis Francheski",
    title: "Assistant Secretary General, Commonwealth",
  },
  {
    name: "Melissa Muindi",
    title: "Academic Director, Strathmore University",
  },
  {
    name: "Mr. Victor Baba",
    title: "Programme Advisor, Weinstein International Foundation",
  },
  {
    name: "Lilian Orieko",
    title: "County Program Manager (Kenya), Lawyers Without Borders",
  },
  {
    name: "Mukhtar Ogel",
    title: "Former Head of Strategic Initiatives, Office of the President",
  },
  {
    name: "Hon. Muthoni Mwangi",
    title: "Court Annexed Mediation Secretary, Judiciary",
  },
];

const Blog = () => {
  return (
    <Box className="p-6 max-w-5xl mx-auto space-y-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Users className="w-14 h-14 mx-auto text-yellow-500 mb-3" />
        <Typography variant="h3" className="font-bold">
          About Us – Team Ubuntu
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Building peace tech for Africa, powered by community and innovation.
        </Typography>
      </motion.div>

      {/* Main Blog Content */}
      <Card>
        <CardContent className="space-y-4">
          <Typography variant="h5" gutterBottom>
            Who We Are
          </Typography>
          <Typography variant="body1" color="textSecondary">
            We are <strong>Team Ubuntu</strong>: Mwangi Morris, Damian Kajwang,
            Maingi, and Stanley Kariuki — facilitated by the{" "}
            <strong>Nuru Trust Network</strong>. We are on a journey of peace
            innovation, building solutions that recognize and empower youth as
            agents of peace.
          </Typography>

          <Typography variant="body1" color="textSecondary">
            Our current project, <strong>Peace Verse</strong>, is a digital
            platform designed to empower young people to engage in peace
            building through polls, safe spaces, radio, and recognition programs
            like the Hall of Fame. We believe that technology can be a bridge to
            dialogue, collaboration, and unity.
          </Typography>

          <Typography variant="body1" color="textSecondary">
            As we move toward the <strong>Global Hackathon in December</strong>,
            our goal is to refine and scale Peace Verse to impact millions of
            young people globally.
          </Typography>
        </CardContent>
      </Card>

      {/* Call for Collaboration */}
      <Card>
        <CardContent className="space-y-3 text-center">
          <Handshake className="w-12 h-12 mx-auto text-blue-400" />
          <Typography variant="h5" gutterBottom>
            Collaboration Invitation
          </Typography>
          <Typography variant="body1" color="textSecondary">
            We are actively looking for <strong>collaborations</strong> with
            NGOs, governments, academic institutions, private sector partners,
            and international organizations. Together, we can amplify the impact
            of peacebuilding across Africa and beyond.
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Partner With Us
          </Button>
        </CardContent>
      </Card>

      {/* Highlight Attendees */}
      <Box>
        <Typography variant="h5" gutterBottom className="mb-4">
          High-Level Advisors & Mentors
        </Typography>
        <Grid container spacing={3}>
          {attendees.map((person, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full">
                  <CardContent>
                    <Star className="text-yellow-500 mb-2" />
                    <Typography variant="h6">{person.name}</Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="mt-1"
                    >
                      {person.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 pt-8">
        Peace Verse © 2025. Youth-led peacebuilding platform for Africa.
        <Globe className="inline w-4 h-4 ml-1" />
      </footer>
    </Box>
  );
};

export default Blog;
