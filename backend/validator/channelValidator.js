import Validator from "fastest-validator";

const v = new Validator();
const schema = {
  name: {
    type: "string",
    required: true,
    messages: {
      required: "name är obligatorisk",
      nameEmpty: "name fältet är tomt",
      name: "name är inte giltigt",
    },
  },
  user_id: {
    type: "string",
    required: true,
    messages: {
      required: "användar id är obligatorisk",
    },
  },
};

const validate = v.compile(schema);
const validatAndSanitize = (data) => {
  const result = validate(data);
  if (result !== true) {
    const sanitizedErrors = result.map((error) => {
      const { expected, actual, type,field , ...rest } = error;
      return rest;
    });
    return sanitizedErrors;
  } else {
    return true;
  }
};
export default validatAndSanitize;
