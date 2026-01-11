[
  {
    "_id": { "$oid": "665200000000000000000001" },
    "movieId": { "$oid": "665000000000000000000001" },
    "theatreId": { "$oid": "665100000000000000000001" },
    "hallId": "Hall-1",
    "startTime": { "$date": "2025-12-22T10:30:00.000Z" },
    "price": 250,
    "seatStatus": {
      "A1": { "status": "available", "reservedUntil": null, "bookingId": null },
      "A2": { "status": "booked", "reservedUntil": null, "bookingId": null },
      "A3": { "status": "available", "reservedUntil": null, "bookingId": null }
    }
  },
  {
    "_id": { "$oid": "665200000000000000000002" },
    "movieId": { "$oid": "665000000000000000000002" },
    "theatreId": { "$oid": "665100000000000000000001" },
    "hallId": "Hall-2",
    "startTime": { "$date": "2025-12-22T14:30:00.000Z" },
    "price": 280,
    "seatStatus": {
      "A1": { "status": "reserved", "reservedUntil": { "$date": "2025-12-22T14:00:00.000Z" }, "bookingId": null },
      "A2": { "status": "available", "reservedUntil": null, "bookingId": null }
    }
  },
  {
    "_id": { "$oid": "665200000000000000000003" },
    "movieId": { "$oid": "665000000000000000000003" },
    "theatreId": { "$oid": "665100000000000000000002" },
    "hallId": "Hall-1",
    "startTime": { "$date": "2025-12-22T11:00:00.000Z" },
    "price": 230,
    "seatStatus": { "B5": { "status": "booked", "reservedUntil": null, "bookingId": null } }
  },
  {
    "_id": { "$oid": "665200000000000000000004" },
    "movieId": { "$oid": "665000000000000000000004" },
    "theatreId": { "$oid": "665100000000000000000002" },
    "hallId": "Hall-2",
    "startTime": { "$date": "2025-12-22T15:00:00.000Z" },
    "price": 220,
    "seatStatus": { "C1": { "status": "available", "reservedUntil": null, "bookingId": null } }
  },
  {
    "_id": { "$oid": "665200000000000000000005" },
    "movieId": { "$oid": "665000000000000000000005" },
    "theatreId": { "$oid": "665100000000000000000003" },
    "hallId": "Hall-B",
    "startTime": { "$date": "2025-12-22T10:00:00.000Z" },
    "price": 260,
    "seatStatus": { "A10": { "status": "available", "reservedUntil": null, "bookingId": null } }
  },
  {
    "_id": { "$oid": "665200000000000000000006" },
    "movieId": { "$oid": "665000000000000000000001" },
    "theatreId": { "$oid": "665100000000000000000004" },
    "hallId": "Hall-1",
    "startTime": { "$date": "2025-12-22T09:45:00.000Z" },
    "price": 210,
    "seatStatus": { "A1": { "status": "available", "reservedUntil": null, "bookingId": null } }
  },
  {
    "_id": { "$oid": "665200000000000000000007" },
    "movieId": { "$oid": "665000000000000000000002" },
    "theatreId": { "$oid": "665100000000000000000005" },
    "hallId": "Hall-IMAX",
    "startTime": { "$date": "2025-12-22T12:00:00.000Z" },
    "price": 320,
    "seatStatus": { "B2": { "status": "booked", "reservedUntil": null, "bookingId": null } }
  },
  {
    "_id": { "$oid": "665200000000000000000008" },
    "movieId": { "$oid": "665000000000000000000003" },
    "theatreId": { "$oid": "665100000000000000000009" },
    "hallId": "Hall-1",
    "startTime": { "$date": "2025-12-22T18:30:00.000Z" },
    "price": 240,
    "seatStatus": { "D4": { "status": "reserved", "reservedUntil": { "$date": "2025-12-22T18:10:00.000Z" }, "bookingId": null } }
  },
  {
    "_id": { "$oid": "665200000000000000000009" },
    "movieId": { "$oid": "665000000000000000000004" },
    "theatreId": { "$oid": "665100000000000000000010" },
    "hallId": "Hall-2",
    "startTime": { "$date": "2025-12-22T20:00:00.000Z" },
    "price": 220,
    "seatStatus": { "A1": { "status": "available", "reservedUntil": null, "bookingId": null } }
  },
  {
    "_id": { "$oid": "665200000000000000000010" },
    "movieId": { "$oid": "665000000000000000000005" },
    "theatreId": { "$oid": "665100000000000000000001" },
    "hallId": "Hall-1",
    "startTime": { "$date": "2025-12-22T19:30:00.000Z" },
    "price": 270,
    "seatStatus": { "B1": { "status": "available", "reservedUntil": null, "bookingId": null } }
  }
]