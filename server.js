require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

//room
const rooms = [
  {
    name: "Denuka Hall",
    seats: 60,
    amenities: ["wifi,projection screen"],
    price: 50,
    roomId: "124",
    bookingDetails: [
      {
        customerName: "Kavin M",
        date: new Date("2023-01-28"),
        start: "07:00",
        end: "10:00",
        status: "confirmed",
      },
    ],
  },
  {
    name: "Darbar Hall",
    seats: 70,
    amenities: ["wifi,projection screen,AC"],
    price: 100,
    roomId: "125",
    bookingDetails: [
      {
        customerName: "Dharun M",
        date: new Date("2023-01-17"),
        start: "15:00",
        end: "17:00",
        status: "Payment Pending",
      },
    ],
  },
  {
    name: "Seminar Hall",
    seats: 150,
    amenities: ["wifi,projection screen,AC,Whiteboard"],
    price: 250,
    roomId: "126",
    bookingDetails: [
      {
        customerName: "Nirmal M",
        date: new Date("2023-1-16"),
        start: "15:00",
        end: "17:00",
        status: "Payment Pending",
      },
    ],
  },
];
//common call api status
app.get("/", (req, res) => {
  res.status(200).send("Hall Booking API");
});

//create room
app.post("/createRoom", (req, res) => {
  rooms.push({
    name: req.body.name,
    seats: req.body.seats,
    amenities: req.body.amenities,
    price: req.body.price,
    roomId: "001",
    bookingDetails: [{}],
  });
  res.status(200).send("Room Created");
});

//Book rooms
app.post("/bookRoom", (req, res, next) => {
  for (let i = 0; i < rooms.length; i++) {
    console.log("Book");
    if (!(rooms[i].roomId === req.body.roomId)) {
      return res.status(400).send({ error: "Invalid" });
    } else {
      let booking = {
        customerName: req.body.name,
        date: new Date(req.body.date),
        start: req.body.start,
        end: req.body.end,
        status: "confirmed",
      };
      let result = undefined;
      rooms[i].bookingDetails.forEach((book) => {
        if (
          book.date.getTime() == booking.date.getTime() &&
          book.start === booking.start
        ) {
          result = 0;
          console.log("in booking");
        } else {
          result = 1;
          rooms[i].bookingDetails.push(booking);
        }
      });
      if (result) return res.status(200).send("Booking confirmed");
      else
        return res
          .status(400)
          .send({ error: "Please select different time slot" });
    }
  }
});

app.get("/bookHistory", (req, res) => {
  let customerArray = [];

  rooms.forEach((room) => {
    let customerObj = { roomName: room.name };

    room.bookingDetails.forEach((customer) => {
      customerObj.customerName = customer.customerName;
      customerObj.date = customer.date;
      customerObj.start = customer.start;
      customerObj.end = customer.end;

      customerArray.push(customerObj);
    });
  });

  res.send(customerArray);
});

//get rooms

app.get("/roomsBooked", (req, res) => {
  console.log("list rooms");
  res.status(200).send(rooms);
});

app.get("/", (req, res) => {
  console.log("Welcome To Hall Booking");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server running on : ${port}`);
});
