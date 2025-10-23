// 🧠 Static seed data (you can safely delete later)
const seedBills = [
  {
    title: "Affordable Housing Support Bill",
    summary:
      "This bill proposes a framework for affordable housing through public-private partnerships aimed at middle and low-income citizens.",
    type: "B",
  },
  {
    title: "Digital Skills Empowerment Initiative",
    summary:
      "A proposal to introduce free digital literacy and coding programs for youths in every county.",
    type: "P",
  },
  {
    title: "Community Health Volunteers Act",
    summary:
      "A bill to provide stipends and insurance for community health volunteers supporting county hospitals.",
    type: "B",
  },
  {
    title: "Green Energy Adoption Program",
    summary:
      "This public proposal aims to incentivize households to install solar systems through tax rebates and microloans.",
    type: "P",
  },
  {
    title: "Public Transport Modernization Plan",
    summary:
      "A bill proposing electric buses for major cities to reduce emissions and improve urban air quality.",
    type: "B",
  },
];

// 🚀 One-time function to upload static data
export const seedBillsToFirestore = async () => {
  try {
    const billsRef = collection(db, "bills");

    console.log("🌱 Starting to seed bills...");
    const results = await Promise.allSettled(
      seedBills.map(async (bill) => {
        const docRef = await addDoc(billsRef, bill);
        return { id: docRef.id, title: bill.title };
      })
    );

    results.forEach((res, index) => {
      if (res.status === "fulfilled") {
        console.log(`✅ Added: ${res.value.title} (ID: ${res.value.id})`);
      } else {
        console.error(`❌ Failed: ${seedBills[index].Title}`, res.reason);
      }
    });

    console.log("🎉 Done seeding all bills!");
  } catch (error) {
    console.error("🔥 Error in seeding:", error);
  }
};
