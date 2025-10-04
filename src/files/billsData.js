/**
 * Initial Bill Data for Amani360 Polling Hub
 * Note: In a production environment, this data would be fetched from Firestore.
 */

export const initialBills = [
  {
    id: 1,
    title: "The Finance Bill 2024",
    type: "Parliamentary",
    description:
      "A highly contentious bill proposing new tax measures, including the introduction of a minimum tax and adjustments to VAT on essential goods. It aims to finance major national development projects.",
    status: "Active Polling",
    yesVotes: 12500,
    noVotes: 45000,
    abstainVotes: 2500,
    userVoted: null, // 'yes', 'no', 'abstain', or null
    voterDemographics: {
      // Mock data for detailed stats (percentage distribution)
      age: { "18-25": 30, "26-40": 45, "41-60": 20, "60+": 5 },
      gender: { Male: 55, Female: 45 },
      region: { Nairobi: 40, Coast: 20, "Rift Valley": 15, Other: 25 },
    },
  },
  {
    id: 2,
    title: "Affordable Housing Levy Act Amendment",
    type: "Parliamentary",
    description:
      "Proposed amendment to the law governing the mandatory housing levy contributions, focusing on collection mechanism and utilization of funds for low-cost housing units.",
    status: "Active Polling",
    yesVotes: 21000,
    noVotes: 18000,
    abstainVotes: 1000,
    userVoted: null,
    voterDemographics: {
      age: { "18-25": 20, "26-40": 50, "41-60": 25, "60+": 5 },
      gender: { Male: 40, Female: 60 },
      region: { Nairobi: 30, Coast: 10, "Rift Valley": 40, Other: 20 },
    },
  },
  {
    id: 3,
    title: "New University Funding Model Review",
    type: "Parliamentary",
    description:
      "Proposed review of the student funding model to ensure equity and access to higher education for vulnerable students, potentially adjusting the financial aid formula.",
    status: "Active Polling",
    yesVotes: 5200,
    noVotes: 3100,
    abstainVotes: 500,
    userVoted: null,
    voterDemographics: {
      age: { "18-25": 70, "26-40": 20, "41-60": 8, "60+": 2 },
      gender: { Male: 48, Female: 52 },
      region: { Nairobi: 25, Coast: 5, "Rift Valley": 50, Other: 20 },
    },
  },
  {
    id: 4,
    title: "Public Bill: Sustainable City Transport Initiative",
    type: "Public Proposal",
    description:
      "A citizen-led bill proposing dedicated non-motorized transport lanes in major urban centers and incentives for electric public transport.",
    status: "Under Review",
    yesVotes: 7800,
    noVotes: 900,
    abstainVotes: 200,
    userVoted: null,
    voterDemographics: {
      age: { "18-25": 40, "26-40": 40, "41-60": 15, "60+": 5 },
      gender: { Male: 60, Female: 40 },
      region: { Nairobi: 60, Coast: 10, "Rift Valley": 10, Other: 20 },
    },
  },
];
