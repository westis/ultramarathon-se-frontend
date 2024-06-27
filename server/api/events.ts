// server/api/events.ts
import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: "localhost",
  user: "ultradb",
  password: "secret",
  database: "ultradb",
});

interface Event {
  EventID: number;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { country, eventType } = query;

  let conn: mariadb.Connection | null = null;
  try {
    conn = await pool.getConnection();

    const events: Event[] = await conn.query(
      `SELECT EventID FROM tevent WHERE Country = ? AND EventType = ?`,
      [country, eventType]
    );

    const performanceSummary = await Promise.all(
      events.map(async (e: Event) => {
        const results = await conn!.query(
          `SELECT COUNT(*) as runners FROM tperformance WHERE EventID = ? AND Distance > 100`,
          [e.EventID]
        );
        return { eventID: e.EventID, runners: results[0]?.runners || 0 };
      })
    );

    // Sort by the number of runners in descending order
    performanceSummary.sort((a, b) => b.runners - a.runners);

    return { status: "success", data: performanceSummary };
  } catch (err) {
    console.error(err);
    const error = err as Error;
    return { status: "error", message: error.message };
  } finally {
    if (conn) await conn.end();
  }
});
