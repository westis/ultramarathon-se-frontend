// server/api/db-connection.ts

// Import your MySQL/MariaDB client library
import mariadb from "mariadb";

export default defineEventHandler(async () => {
  // Replace these with your database credentials
  const dbConfig = {
    host: "localhost", // Change this if needed
    user: "ultradb",
    password: "secret",
    database: "ultradb",
  };

  try {
    const connection = await mariadb.createConnection(dbConfig);
    const [rows] = await connection.query("SELECT 1 + 1 AS solution");
    await connection.end();

    return {
      status: "success",
      message: "Successfully connected to the database!",
      data: rows,
    };
  } catch (err) {
    // Type-cast err to Error for better type handling
    const error = err as Error;
    return {
      status: "error",
      message: "Database connection failed!",
      error: error.message,
    };
  }
});
