import Validator from "fastest-validator";

const v = new Validator();
const schema = {
  user_id: {
    type: "string",
    required: true,
    messages: {
      required: "user_id är obligatorisk",
      user_idEmpty: "user_id fältet är tomt",
      user_id: "user_id är inte giltigt",
    },
  },
  channel_id: {
    type: "string",
    required: true,
    messages: {
      required: "channel_id är obligatorisk",
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
