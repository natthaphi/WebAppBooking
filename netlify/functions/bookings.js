const { ensureSchema, sql } = require("./db");

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

exports.config = {
  path: "/api/bookings"
};

exports.handler = async (event) => {
  try {
    await ensureSchema();

    if (event.httpMethod === "GET") {
      const rows = await sql`
        SELECT id, name, date, time, phone, email, note, status
        FROM bookings
        ORDER BY date ASC, time ASC, id ASC;
      `;

      return jsonResponse(200, rows);
    }

    if (event.httpMethod === "POST") {
      const payload = event.body ? JSON.parse(event.body) : {};
      const { name, date, time, phone, email, note } = payload;

      if (!name || !date || !time || !phone) {
        return jsonResponse(400, { msg: "Missing required fields" });
      }

      const [created] = await sql`
        INSERT INTO bookings (name, date, time, phone, email, note)
        VALUES (${name}, ${date}, ${time}, ${phone}, ${email || null}, ${note || null})
        RETURNING id, name, date, time, phone, email, note, status;
      `;

      return jsonResponse(201, { msg: "บันทึกคิวสำเร็จ", data: created });
    }

    return jsonResponse(405, { msg: "Method not allowed" });
  } catch (error) {
    return jsonResponse(500, { msg: "Server error" });
  }
};
