const AccountBalance = require("../models/accountBalance");

const playRoulette = async (req, res) => {
  try {
    const bet = parseInt(req.body.credits);
    const actuallBalance = await AccountBalance.findOne({ userID: req.user._id });
    if (actuallBalance.state < bet) {
      const toSend = {
        message: "You don't have enough credits!",
        result: "",
      };
      res.send(toSend);
      return;
    }
    const result = Math.floor(Math.random() * 21);
    if (result === parseInt(req.body.number)) {
      const toSend = {
        message: "You have won your bet!",
        result: result,
      };
      const newBalance = bet * 30 + actuallBalance.state;
      await AccountBalance.updateOne({ userID: req.user._id }, { $set: { state: newBalance } });
      res.send(toSend);
      return;
    }
    const toSend = {
      message: "You have lost your bet!",
      result: result,
    };
    const newBalance = actuallBalance.state - bet;
    await AccountBalance.updateOne({ userID: req.user._id }, { state: newBalance });
    res.send(toSend);
    return;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { playRoulette };