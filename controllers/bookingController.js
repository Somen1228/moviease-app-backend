const Bookings = require("../models/bookingModel");
const Shows = require("../models/showModel");
const { sendEmail } = require("../utils/NotificationUtil");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const makePayment = async (req, res) => {
  const { token, amount, show, selectedSeats } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      customer: customer.id,
      payment_method_types: ["card"],
      receipt_email: token.email,
      description: "Payment has been initiated",
    });

    const transactionId = paymentIntent.id;

    sendEmail(
      [customer.email],
      "Payment Successfull",
      `
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 400px; margin: auto; text-align: center; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="color: #28a745; font-size: 24px; margin-bottom: 10px;">
              Payment Successful!
        </div>
        <div style="margin: 20px 0; font-size: 18px; color: #333333;">
            Transaction ID: <span style="font-weight: bold;">${transactionId}</span><br>
            Paid by: Card ending with <span style="font-weight: bold;">${
              token.card.last4
            }</span>
        </div>

        <div style="font-size: 16px; color: #555555; text-align: left; margin-top: 20px;">
            Your booking has been confirmed. Below are the details of your show:
        </div>

        <div style="margin: 20px 0; font-size: 18px; color: #333333; text-align: left;">
          <p><strong>Show Name:</strong> ${show.name}</p>
          <p><strong>Date:</strong> ${new Date(
            show.date
          ).toLocaleDateString()}
          </p>
          <p><strong>Time:</strong> ${show.time}</p>
          <p><strong>Theatre:</strong> ${show.theatre.name}, ${
          show.theatre.address
          }</p>
          <p><strong>Booked Seats:</strong> ${selectedSeats.join(", ")}</p>
          <p><strong>Ticket Price:</strong> Rs. ${show.ticketPrice * selectedSeats.length}/-</p>
        </div>

        <div style="font-size: 14px; color: #777777; margin-top: 20px;">
            Thank you for your payment!
        </div>
      </div>

      `
    );
    res.send({
      success: true,
      message: "Payment successfull",
      data: transactionId,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
      data: transactionId,
    });
  }
};

const createBooking = async (req, res) => {
  req.body.user = req.userDetails._id;

  try {
    const newBooking = new Bookings(req.body);
    await newBooking.save();

    const show = await Shows.findById(req.body.show);
    const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];

    await Shows.findByIdAndUpdate(req.body.show, {
      bookedSeats: updatedBookedSeats,
    });

    return res.status(201).send({
      success: true,
      message: "New Booking Done!",
      data: newBooking,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const getAllBookings = async (req, res) => {
  const userDetails = req.userDetails;
  let condition;
  if (userDetails.isAdmin) {
    condition = {};
  } else {
    condition = { user: userDetails._id };
  }
  

  try {
    const allBookings = await Bookings.find(condition)
      .populate({
        path: 'show',
        populate: [
          { path: 'theatre' }, // Populate the theatre details
          { path: 'movie' }    // Populate the movie details
        ]
      })
      .populate('user'); // Populate user details

    return res.status(200).send({
      success: true,
      message: 'Bookings fetched successfully',
      data: allBookings
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  makePayment,
  createBooking,
  getAllBookings,
};
