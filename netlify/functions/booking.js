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
  path: "/api/bookings/:id"
};

exports.handler = async (event) => {
  try {
    await ensureSchema();

    const id = event.pathParameters ? event.pathParameters.id : null;

    if (!id) {
      return jsonResponse(400, { msg: "Missing booking id" });
    }

    if (event.httpMethod === "PUT") {
      const payload = event.body ? JSON.parse(event.body) : {};

      const [existing] = await sql`
        SELECT id, name, date, time, phone, email, note, status
        FROM bookings
        WHERE id = ${id};
      `;

      if (!existing) {
        return jsonResponse(404, { msg: "ไม่พบข้อมูล" });
      }

      const updated = {
        name: payload.name ?? existing.name,
        date: payload.date ?? existing.date,
        time: payload.time ?? existing.time,
        phone: payload.phone ?? existing.phone,
        email: payload.email ?? existing.email,
        note: payload.note ?? existing.note,
        status: payload.status ?? existing.status
      };

      const [saved] = await sql`
        UPDATE bookings
        SET name = ${updated.name},
            date = ${updated.date},
            time = ${updated.time},
            phone = ${updated.phone},
            email = ${updated.email},
            note = ${updated.note},
            status = ${updated.status}
        WHERE id = ${id}
        RETURNING id, name, date, time, phone, email, note, status;
      `;

      return jsonResponse(200, { msg: "อัปเดตสำเร็จ", data: saved });
    }

    if (event.httpMethod === "DELETE") {
      await sql`
        DELETE FROM bookings
        WHERE id = ${id};
      `;

      return jsonResponse(200, { msg: "ลบคิวเรียบร้อยแล้ว" });
    }

    return jsonResponse(405, { msg: "Method not allowed" });
  } catch (error) {
    return jsonResponse(500, { msg: "Server error" });
  }
};
