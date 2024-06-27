// file path: /frontend/server/api/duv.ts
import { defineEventHandler, readBody } from "h3";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const response = await fetch("https://statistik.d-u-v.org/bulk_search.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });

  const text = await response.text();

  // Parse the HTML response using JSDOM
  const dom = new JSDOM(text);
  const document = dom.window.document;

  // Extract relevant data (example: extracting table rows)
  const table = document.querySelector("table"); // Adjust the selector to match the table in the response
  const rows = table ? Array.from(table.querySelectorAll("tr")) : [];

  const data = rows.map((row) => {
    const cells = row.querySelectorAll("td");
    return Array.from(cells).map((cell) => cell.textContent?.trim() || "");
  });

  return data;
});
