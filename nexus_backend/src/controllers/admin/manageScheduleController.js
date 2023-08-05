const moment = require("moment");
const { Op } = require("sequelize");
const db = require("../../models/index");
const { responseModel } = require("../../responses");
const Schedule = db.manage_schedule;
const Class = db.manageClasses;
const User = db.users;
exports.getAllSchedule = async (req, res) => {
  try {
    let { limit, page } = req.query;

    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;
    let response = {};
    const schedules = await Schedule.findAll({
      limit: limit,
      offset: limit * (page - 1),
      include: [{ model: Class, attributes: ["eventName"] }],
    });
    const count = await Schedule.count();

    response = responseModel.successResponse("Success", {
      schedules,
      total: count,
    });
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.getRepeatEvent = async (req, res) => {
  try {
    const schedule = await Schedule.findAll({
      group: ["startDate", "endDate"],
      attributes: ["startDate", "endDate"],
    });
    res.json(schedule);
  } catch (error) {
    res.status(200).json(error.message);
  }
};

exports.getSchedule = async (req, res) => {
  try {
    let response = {};
    let schedule = await Schedule.findOne({
      where: { id: req.params.id },
      include: [
        { model: Class, attributes: ["eventName"] },
        { model: User, attributes: ["id", "first_name"] },
      ],
    });
    if (!schedule) {
      response = responseModel.failResponse("Schedule not found", {});
    } else {
      response = responseModel.successResponse("Success", schedule);
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.addSchedule = async (req, res) => {
  try {
    const {
      classId,
      startDate,
      endDate,
      startTime,
      endTime,
      userId,
      isRepeat,
      day,
    } = req.body;

    let schedule = {
      classId,
      startDate,
      startTime,
      endDate,
      endTime,
      userId,
      isRepeat,
      day,
    };
    let scheduleIfRepeat = req.body;
    let response = {};
    const curerntDate = new Date();
    if (isRepeat === false) {
      if (
        moment(startDate).format().split("T")[0] &&
        moment(endDate).format().split("T")[0] >=
          moment(curerntDate).format().split("T")[0]
      ) {
        if (moment(startDate).format() === moment(endDate).format()) {
          return Schedule.create(schedule)
            .then(async (response) => {
              response = responseModel.successResponse(
                "Success Event is created",
                response
              );
              res.status(response.status).send(response.data);
            })
            .catch((err) => {
              response = responseModel.failResponse("Something went wrong", {});
              res.status(response.status).send(response.data);
            });
        } else {
          response = responseModel.failResponse(
            "Please select days when you add multi date evvent",
            {}
          );
          return res.status(response.status).send(response.data);
        }
      } else {
        response = responseModel.failResponse("Past date are not allow!!!", {});
        return res.status(response.status).send(response.data);
      }
    }
    return Schedule.bulkCreate(scheduleIfRepeat)
      .then(async (response) => {
        response = responseModel.successResponse(
          "Success Event is created",
          response
        );
        return res.status(response.status).send(response.data);
      })
      .catch((err) => {
        response = responseModel.failResponse("Something went wrong", {});
        res.status(response.status).send(response.data);
      });
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      classId,
      startDate,
      endDate,
      startTime,
      endTime,
      userId,
      isRepeat,
      day,
    } = req.body;

    let schedule = await Schedule.findOne({
      where: { id },
    });
    const data = req.body;
    if (!schedule) {
      let response = responseModel.failResponse("Schedule not found", {});
      return res.status(response.status).send(response.data);
    } else {
      let updatedData = {
        classId,
        startDate,
        endDate,
        startTime,
        endTime,
        userId,
        isRepeat,
        day,
      };
      const curerntDate = new Date();
      const momentCurrentDate = moment(curerntDate).format().split("T")[0];
      const momentStartDate = moment(updatedData.startDate)
        .format()
        .split("T")[0];
      const momentEndDate = moment(updatedData.endDate).format().split("T")[0];
      console.log("momentCurrentDate", momentCurrentDate);
      console.log("momentStartDate", momentStartDate);
      console.log("momentEndDate", momentEndDate);

      if ((momentStartDate && momentEndDate) < momentCurrentDate) {
        let response = {};
        response = responseModel.failResponse(
          "You are not allow for edit past date",
          response
        );
        return res.status(response.status).send(response.data);
      }
      if (
        momentStartDate === moment(schedule.startDate).format().split("T")[0] &&
        momentEndDate === moment(schedule.endDate).format().split("T")[0]
      ) {
        return Schedule.update(updatedData, { where: { id } })
          .then(() => {
            let response = responseModel.successResponse(
              "Schedule updated successfully",
              {}
            );  
            return res.status(response.status).send(response.data);
          })
          .catch((err) => {
            let response = responseModel.failResponse(err.message, {});
            return res.status(response.status).send(response.data);
          });
      } else {
        if (momentStartDate === momentEndDate) {
          return Schedule.create(updatedData)
            .then((ress) => {
              let response = responseModel.successResponse(
                "New Event is created",
                { data: ress }
              );
              return res.status(response.status).send(response.data);
            })
            .catch((err) => {
              let response = responseModel.failResponse(err.message, {});
              return res.status(response.status).send(response.data);
            });
        } else {
          response = responseModel.failResponse(
            "You are not select multiple date",
            {}
          );
          return res.status(response.status).send(response.data);
        }
      }
    }
  } catch (err) {}
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    let schedule = await Schedule.findOne({
      where: { id },
    });
    if (!schedule) {
      let response = responseModel.failResponse("Schedule not found", {});
      return res.status(response.status).send(response.data);
    } else {
      await Schedule.update({ is_deleted: 1 }, { where: { id } });
      const isDel = await Schedule.destroy({
        where: { id },
      });
      let response = {};
      if (isDel) {
        response = responseModel.successResponse(
          "Schedule Deleted Successfully",
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

exports.deleteScheduleByEvent = async (req, res) => {
  try {
    const { id } = req.params;

    let schedule = await Schedule.findOne({
      where: { id },
    });
    if (!schedule) {
      let response = responseModel.failResponse("Schedule not found", {});
      return res.status(response.status).send(response.data);
    } else {
      const responseData = Schedule.destroy({
        where: {
          [Op.and]: [
            { startDate: schedule.startDate },
            { endDate: schedule.endDate },
            { classId: schedule.classId },
          ],
        },
      });
      if (responseData) {
        let response = responseModel.successResponse(
          "Delete Following events",
          {}
        );
        return res.status(response.status).send(response.data);
      }
    }
  } catch (error) {
    res.json(error.message);
  }
};

// var startDate = new Date("2017-10-01"); //YYYY-MM-DD
// var endDate = new Date("2017-10-07"); //YYYY-MM-DD

// var getDateArray = function(start, end) {
//     var arr = new Array();
//     var dt = new Date(start);
//     while (dt <= end) {
//         arr.push(new Date(dt));
//         dt.setDate(dt.getDate() + 1);
//     }
//     return arr;
// }

// var dateArr = getDateArray(startDate, endDate);

// if (
//   moment(updatedData.startDate).format().split("T")[0] &&
//   moment(updatedData.endDate).format().split("T")[0] >=
//     moment(curerntDate).format().split("T")[0]
// ) {
//   if (updatedData.startDate === updatedData.endDate) {
//     await Schedule.update(updatedData, { where: { id } })
//       .then(() => {
//         let response = responseModel.successResponse(
//           "Schedule updated successfully",
//           {}
//         );
//         return res.status(response.status).send(response.data);
//       })
//       .catch((err) => {
//         let response = responseModel.failResponse(err.message, {});
//         return res.status(response.status).send(response.data);
//       });
//   } else {
//     if (
//       !updatedData.isRepeat &&
//       moment(updatedData.startDate).format().split("T")[0] ===
//         moment(updatedData.endDate).format().split("T")[0]
//     ) {
//       return Schedule.create(updatedData)
//         .then(async (response) => {
//           response = responseModel.successResponse(
//             "New event is created",
//             response
//           );
//           res.status(response.status).send(response.data);
//         })
//         .catch((err) => {
//           response = responseModel.failResponse(
//             "Something went wrong 1",
//             {}
//           );
//           res.status(response.status).send(response.data);
//         });
//     } else {
//       response = responseModel.successResponse(
//         "Please select days when you add multi date evvent ",
//         response
//       );
//       res.status(response.status).send(response.data);
//     }
//     if (updatedData.isRepeat) {
//       return Schedule.bulkCreate(req.body)
//         .then(async (response) => {
//           response = responseModel.successResponse(
//             "Multipale Event is created",
//             response
//           );
//           return res.status(response.status).send(response.data);
//         })
//         .catch((err) => {
//           response = responseModel.failResponse(
//             "Something went wrong 2",
//             {}
//           );
//           res.status(response.status).send(response.data);
//         });
//     }
//   }
// } else {
//   const response = responseModel.failResponse(
//     "Past date are not allow!!",
//     {}
//   );
//   return res.status(response.status).send(response.data);
// }
