const { User } = require("../models/users");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
     //   const schema = Joi.object({ email: Joi.string().email().required() });
       // const { error } = schema.validate(req.body);
       // if (error) return res.status(400).send(error.details[0].message);
       UserSchema

        .findOne({ email: req.body.email });
        if (!User)
            return res.status(400).send("User with given email doesn't exist");

        let token = await Token.findOne({ userId: User._id });
        if (!token) {
            token = await new Token({
                userId: User._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `${process.env.BASE_URL}/password-reset/${User._id}/${token.token}`;
        await sendEmail(User.email, "Password reset", link);
        res.send("Password reset link sent to your email account");
    } catch (error) {
        res.send("An error occurred");
        console.log(error);
    }
});

router.post("/:userId/:token", async (req, res) => {
    try {
       // const schema = Joi.object({ password: Joi.string().required() });
       // const { error } = schema.validate(req.body);
       // if (error) return res.status(400).send(error.details[0].message);
        UserSchema
        .findById(req.params.userId);
        if (!User) return res.status(400).send("Invalid link or expired");

        const token = await Token.findOne({
            userId: User._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        User.password = req.body.password;
        await User.save();
        await token.delete();
        res.send("Password reset successfully.");
    } catch (error) {
        res.send("An error occurred");

        
        console.log(error);
    }
});

module.exports = router;