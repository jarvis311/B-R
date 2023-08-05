const { READ, WRITE, EXECUTE } = require("./permissions");

exports.rolesData= [
  {
    role: READ,
    description: "can read",
  },
  {
    role: WRITE,
    description: "can write",
  },
  {
    role: EXECUTE,
    description: "can delete",
  },

]
