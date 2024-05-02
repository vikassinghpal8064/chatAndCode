let express = require("express");
let router = express.Router();
let User = require("../models/User");
let Education = require("../models/Education");
router.get("/getAll", async (req, res) => {
  try {
    let allUser = await User.find({});
    res.status(200).send(allUser);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

//adding a new user
router.post("/signup", async (req, res) => {
  try {
    let { firstName, lastName, userName, password, email, phone } = req.body;
    let newUser = await User.create({
      firstName,
      lastName,
      
      userName,
      password,
      email,
      phone,
    });
    newUser.save();
    res.status(201).send({ message: "the user is successfully resgistered" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
//updating userEducation info
router.post("/userEdu/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let user = await User.findById(id);
    let { school, college } = req.body;
    // console.log(user.education._id);
    if (user.education._id.toString()) {
      let item = await Education.findByIdAndDelete(
        user.education._id.toString()
      );
    //   console.log("i am deleted  ", item._id);
      let education = await Education.create({ school, college });
      education.save();
      //    console.log(education);
      user.education = education._id;
      user.save();
    } else {
      let education = await Education.create({ school, college });
      education.save();
      console.log(education);
      user.education = education._id;
      user.save();
    }

    res.status(201).send({ message: "successsfully created" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
