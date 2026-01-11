[
  {
    "_id": { "$oid": "665100000000000000000001" },
    "id": 1,
    "name": "CineBitez - Downtown",
    "rating": 8.2,
    "price": 220,
    "location": "Downtown, City Center",
    "bg": "https://example.com/theatres/downtown/bg.jpg",
    "pics": ["https://example.com/theatres/downtown/1.jpg", "https://example.com/theatres/downtown/2.jpg"],
    "halls": [
      { "hallId": "Hall-1", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "AAAA_AAAA", "BBBB_BBBB", "BBBB_BBBB", "CCCC_CCCC"] },
      { "hallId": "Hall-2", "type": "imax",     "layoutTemplate": ["AAAAAA_AAAAAA", "AAAAAA_AAAAAA", "BBBBBB_BBBBBB", "CCCCCC_CCCCCC"] }
    ],
    "shows": [
      { "movie": { "$oid": "665000000000000000000001" }, "languages": ["english"], "showTimings": ["10:30 AM", "02:30 PM", "07:30 PM"] }
    ]
  },
  {
    "_id": { "$oid": "665100000000000000000002" },
    "id": 2,
    "name": "CineBitez - North Mall",
    "rating": 7.9,
    "price": 200,
    "location": "North Mall, Level 3",
    "bg": "https://example.com/theatres/northmall/bg.jpg",
    "pics": ["https://example.com/theatres/northmall/1.jpg"],
    "halls": [
      { "hallId": "Hall-1", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "AAAA_AAAA", "BBBB_BBBB", "CCCC_CCCC"] },
      { "hallId": "Hall-2", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "BBBB_BBBB", "BBBB_BBBB", "CCCC_CCCC"] }
    ],
    "shows": [
      { "movie": { "$oid": "665000000000000000000002" }, "languages": ["english", "hindi"], "showTimings": ["11:00 AM", "03:00 PM", "08:00 PM"] }
    ]
  },
  {
    "_id": { "$oid": "665100000000000000000003" },
    "id": 3,
    "name": "CineBitez - East Side",
    "rating": 8.0,
    "price": 210,
    "location": "East Side, River Road",
    "bg": "https://example.com/theatres/eastside/bg.jpg",
    "pics": ["https://example.com/theatres/eastside/1.jpg"],
    "halls": [
      { "hallId": "Hall-A", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "AAAA_AAAA", "BBBB_BBBB", "BBBB_BBBB"] },
      { "hallId": "Hall-B", "type": "4dx",      "layoutTemplate": ["AAAAAA_AAAAAA", "BBBBBB_BBBBBB", "CCCCCC_CCCCCC"] }
    ],
    "shows": [
      { "movie": { "$oid": "665000000000000000000003" }, "languages": ["tamil", "telugu"], "showTimings": ["10:00 AM", "01:45 PM", "06:45 PM"] }
    ]
  },
  {
    "_id": { "$oid": "665100000000000000000004" },
    "id": 4,
    "name": "CineBitez - West Plaza",
    "rating": 7.6,
    "price": 190,
    "location": "West Plaza, Block B",
    "bg": "https://example.com/theatres/westplaza/bg.jpg",
    "pics": ["https://example.com/theatres/westplaza/1.jpg"],
    "halls": [
      { "hallId": "Hall-1", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "BBBB_BBBB", "BBBB_BBBB", "CCCC_CCCC"] },
      { "hallId": "Hall-2", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "AAAA_AAAA", "BBBB_BBBB", "CCCC_CCCC"] }
    ],
    "shows": [
      { "movie": { "$oid": "665000000000000000000004" }, "languages": ["english", "hindi"], "showTimings": ["09:45 AM", "02:15 PM", "09:15 PM"] }
    ]
  },
  {
    "_id": { "$oid": "665100000000000000000005" },
    "id": 5,
    "name": "CineBitez - Airport Road",
    "rating": 8.4,
    "price": 260,
    "location": "Airport Road, Terminal View",
    "bg": "https://example.com/theatres/airport/bg.jpg",
    "pics": ["https://example.com/theatres/airport/1.jpg", "https://example.com/theatres/airport/2.jpg"],
    "halls": [
      { "hallId": "Hall-IMAX", "type": "imax", "layoutTemplate": ["AAAAAA_AAAAAA", "AAAAAA_AAAAAA", "BBBBBB_BBBBBB", "CCCCCC_CCCCCC"] },
      { "hallId": "Hall-STD",  "type": "standard", "layoutTemplate": ["AAAA_AAAA", "BBBB_BBBB", "CCCC_CCCC", "CCCC_CCCC"] }
    ],
    "shows": [
      { "movie": { "$oid": "665000000000000000000005" }, "languages": ["english"], "showTimings": ["12:00 PM", "04:00 PM", "08:30 PM"] }
    ]
  },
  {
    "_id": { "$oid": "665100000000000000000006" },
    "id": 6,
    "name": "CineBitez - Lake View",
    "rating": 7.8,
    "price": 205,
    "location": "Lake View, Sector 9",
    "bg": "https://example.com/theatres/lakeview/bg.jpg",
    "pics": ["https://example.com/theatres/lakeview/1.jpg"],
    "halls": [
      { "hallId": "Hall-1", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "AAAA_AAAA", "BBBB_BBBB", "BBBB_BBBB", "CCCC_CCCC"] },
      { "hallId": "Hall-2", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "BBBB_BBBB", "BBBB_BBBB", "CCCC_CCCC", "DDDD_DDDD"] }
    ],
    "shows": []
  },
  {
    "_id": { "$oid": "665100000000000000000007" },
    "id": 7,
    "name": "CineBitez - Tech Park",
    "rating": 8.1,
    "price": 240,
    "location": "Tech Park, Tower 2",
    "bg": "https://example.com/theatres/techpark/bg.jpg",
    "pics": ["https://example.com/theatres/techpark/1.jpg"],
    "halls": [
      { "hallId": "Hall-Alpha", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "BBBB_BBBB", "BBBB_BBBB", "CCCC_CCCC"] },
      { "hallId": "Hall-Beta",  "type": "standard", "layoutTemplate": ["AAAA_AAAA", "AAAA_AAAA", "BBBB_BBBB", "CCCC_CCCC"] }
    ],
    "shows": []
  },
  {
    "_id": { "$oid": "665100000000000000000008" },
    "id": 8,
    "name": "CineBitez - Old Town",
    "rating": 7.4,
    "price": 180,
    "location": "Old Town, Main Street",
    "bg": "https://example.com/theatres/oldtown/bg.jpg",
    "pics": ["https://example.com/theatres/oldtown/1.jpg"],
    "halls": [
      { "hallId": "Hall-1", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "BBBB_BBBB", "CCCC_CCCC"] },
      { "hallId": "Hall-2", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "AAAA_AAAA", "BBBB_BBBB"] }
    ],
    "shows": []
  },
  {
    "_id": { "$oid": "665100000000000000000009" },
    "id": 9,
    "name": "CineBitez - City Square",
    "rating": 8.3,
    "price": 230,
    "location": "City Square, Metro Exit",
    "bg": "https://example.com/theatres/citysquare/bg.jpg",
    "pics": ["https://example.com/theatres/citysquare/1.jpg", "https://example.com/theatres/citysquare/2.jpg"],
    "halls": [
      { "hallId": "Hall-1", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "AAAA_AAAA", "BBBB_BBBB", "CCCC_CCCC"] },
      { "hallId": "Hall-2", "type": "imax",     "layoutTemplate": ["AAAAAA_AAAAAA", "BBBBBB_BBBBBB", "CCCCCC_CCCCCC"] }
    ],
    "shows": []
  },
  {
    "_id": { "$oid": "665100000000000000000010" },
    "id": 10,
    "name": "CineBitez - South Gate",
    "rating": 7.7,
    "price": 195,
    "location": "South Gate, Highway Junction",
    "bg": "https://example.com/theatres/southgate/bg.jpg",
    "pics": ["https://example.com/theatres/southgate/1.jpg"],
    "halls": [
      { "hallId": "Hall-1", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "BBBB_BBBB", "BBBB_BBBB", "CCCC_CCCC"] },
      { "hallId": "Hall-2", "type": "standard", "layoutTemplate": ["AAAA_AAAA", "AAAA_AAAA", "BBBB_BBBB", "CCCC_CCCC"] }
    ],
    "shows": []
  }
]