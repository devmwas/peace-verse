// src/utils/dataFetcher.js

// Simulate the content of your src/files/bills.txt
// In a real application, you would load this file using 'fs' on a server,
// or fetch it from an API endpoint where the data is stored.
const BILLS_DATA_STRING = `Type	Title	Status	Source	Summary	Votes_For	Votes_Against
B	The Finance Bill 2024	Active	Parliament	Proposed new taxes and amendments to existing fiscal laws. A key focus is on digital and environmental levies.	15000	85000
B	The Affordable Housing Levy Bill, 2023	Past	Parliament	Legislation that established the framework and collection mechanism for the Housing Levy.	30000	10000
B	New University Funding Model Bill	Active	Parliament	Legislation to formalize the student-centric funding framework for universities and TVETs, replacing the previous system.	5000	2500
P	Citizen Proposal for Public Service Asset Disclosure	Proposed	Public (Amani360 User)	A proposal to lower the threshold and increase the frequency of public disclosure for assets held by high-ranking civil servants.	500	50
P	Local Food Security and Subsidy Initiative Bill	Active	Public (Agri-Community Group)	A proposal to mandate county governments allocate a minimum of 10% of their annual development budget to local, small-scale farming subsidies.	800	120
P	Past Bill Review Mechanism Proposal	Past	Public (Governance Watchdog)	A system allowing citizens to trigger a formal legislative review of past laws after a 5-year period.	1200	300
`;

/**
 * Parses the tab-separated string data into an array of JavaScript objects.
 * Assigns a unique ID for React's key property.
 * @returns {Array} An array of bill objects.
 */
export const fetchBillData = () => {
  // 1. Split the data into lines
  const lines = BILLS_DATA_STRING.trim().split("\n");

  // 2. Extract the header (first line) and split by tab
  const headers = lines[0].split("\t");

  // 3. Process the remaining lines (the data rows)
  const data = lines.slice(1).map((line, index) => {
    const values = line.split("\t");
    let bill = { id: index + 1 }; // Add a unique ID

    // Map header to value for each column
    headers.forEach((header, i) => {
      // Clean up votes: ensure they are numbers
      if (header === "Votes_For" || header === "Votes_Against") {
        bill[header] = parseInt(values[i], 10);
      } else {
        bill[header] = values[i];
      }
    });
    return bill;
  });

  return data;
};

// You can test this in the browser console:
// console.log(fetchBillData());
