const db = require("../../models/index");
const { responseModel } = require("../../responses");
const Booking = db.booking;
const Plan = db.plan;
const Schedule = db.manage_schedule;
const Customer = db.customer;

exports.getAllBooking = async (req, res) => {
  try {
    let { limit, page } = req.query;
    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;

    let response = {};
    const bookingData = await Booking.findAll({
      limit: limit,
      offset: limit * (page - 1),
      include: [
        {
          model: Customer,
          as: "customer",
        },
        {
          model: Schedule,
          as: "manage_schedule",
        },
        {
          model: Plan,
          as: "plan",
        },
      ],
    });

    // const count = await bookingData.count();
    response = responseModel.successResponse("Success", {
      bookingData,
    });
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.getBooking = async (req, res) => {
  try {
    let response = {};
    let getBookingData = await Booking.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: [Plan, Schedule, Customer],
        },
      ],
    });
    if (!getBookingData) {
      response = responseModel.failResponse("Booking not found", {});
    } else {
      response = responseModel.successResponse("Success", getBookingData);
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.addBooking = async (req, res) => {
  try {
    const { scheduleId, planId, customerId, credits } = req.body;

    let booking = {
      scheduleId,
      planId,
      customerId,
      credits,
    };
    let response = {};
    return Booking.create(booking)
      .then(async (response) => {
        await Customer.update(
          { planId: response.dataValues.planId },
          { where: { id: response.dataValues.customerId } }
        );
        response = responseModel.successResponse("Success", response);
        res.status(response.status).send(response.data);
        return response.data;
      })
      .catch((err) => {
        response = responseModel.failResponse("Something went wrong", {
          message: err.message,
        });
        res.status(response.status).send(response.data);
      });
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduleId, planId, customerId } = req.body;

    let booking = await Booking.findOne({
      where: { id },
    });

    if (!booking) {
      let response = responseModel.failResponse("Booking not found", {});
      return res.status(response.status).send(response.data);
    } else {
      let updatedData = {
        scheduleId,
        planId,
        customerId,
        credits,
      };
      await Booking.update(updatedData, { where: { id } })
        .then(() => {
          let response = responseModel.successResponse(
            "Booking updated successfully",
            {}
          );
          return res.status(response.status).send(response.data);
        })
        .catch((err) => {
          let response = responseModel.failResponse(err.message, {});
          return res.status(response.status).send(response.data);
        });
    }
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    let boooking = await Booking.findOne({
      where: { id },
    });
    if (!boooking) {
      let response = responseModel.failResponse("Booking not found", {});
      return res.status(response.status).send(response.data);
    } else {
      await Booking.update({ is_deleted: 1 }, { where: { id } });
      const isDel = await Booking.destroy({
        where: { id },
      });
      let response = {};
      if (isDel) {
        response = responseModel.successResponse(
          "Booking Deleted Successfully",
          {}
        );
      } else {
        response = responseModel.failResponse("Something went wrong", {});
      }
      return res.status(response.status).send(response.data);
    }
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};

// Consider fields Event name, description, type(Special,Regular), Is plan mandatory(Yes/No), Plan name or id
