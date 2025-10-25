// src/utils/exportHelpers.js
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const exportVotesToCSV = (filename, votes) => {
  const headers = ["#", "Display Name", "Vote Option", "Anonymous"];
  const rows = votes.map((v, i) => [
    i + 1,
    v.isAnonymous ? "Anonymous User" : v.userDisplayName,
    v.voteOption,
    v.isAnonymous ? "Yes" : "No",
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportVotesToJSON = (filename, votes) => {
  const blob = new Blob([JSON.stringify(votes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportVotesToPDF = (filename, votes) => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(`${filename} - Vote Summary`, 10, 10);

  let y = 20;
  votes.forEach((v, i) => {
    doc.text(
      `${i + 1}. ${v.isAnonymous ? "Anonymous User" : v.userDisplayName} — ${
        v.voteOption
      }`,
      10,
      y
    );
    y += 8;
  });

  doc.save(`${filename}.pdf`);
};
