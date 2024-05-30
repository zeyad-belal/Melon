const Joi = require("joi");
const AppError = require("../AppError");

const postCreationValidationSchema = Joi.object({
  description: Joi.string().required(),
  keywords: Joi.string(),
  images: Joi.array(),
  user_id: Joi.string()
});

const postCreationValidation = (req, res, next) => {
  console.log(req.body)
  const { error } = postCreationValidationSchema.validate({
    description: req.body.description,
    keywords: req.body.keywords,
    images: req.files,
    user_id: req.body.user_id
  });
  if (error) console.log(error) 
  if (error) return next(new AppError(error.name, 404));
  next();
};

module.exports = { postCreationValidation };
