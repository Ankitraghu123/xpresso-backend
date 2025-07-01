const SuperCoinSchema = require("../models/SuperCoinSchema");

// Utility: expire coins older than 30 days
function filterValidCoins(history) {
  const now = new Date();
  return history.filter((item) => !item.expiresAt || item.expiresAt > now);
}

// Get user’s current coin balance and history
exports.getCoins = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId, "userId");
    const userCoins = await SuperCoinSchema.findOne({ userId });
    if (!userCoins) {
      return res.json({ success: true, data: { coins: 0, history: [] } });
    }
    const validHistory = filterValidCoins(userCoins.history);
    const validCoins = validHistory.reduce((sum, h) => {
      if (["registration", "referral", "purchase"].includes(h.type)) {
        return sum + h.coins;
      } else if (h.type === "redeem") {
        return sum - h.coins;
      }
      return sum;
    }, 0);

    res.json({
      success: true,
      data: {
        coins: validCoins,
        history: validHistory,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Earn coins
exports.addCoins = async (userId, coins, type, description = "") => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 1 month expiry

  let superCoinDoc = await SuperCoinSchema.findOne({ userId });

  const newHistory = {
    type,
    coins,
    description,
    createdAt: new Date(),
    expiresAt,
  };

  if (!superCoinDoc) {
    superCoinDoc = await SuperCoinSchema.create({
      userId,
      coins,
      history: [newHistory],
    });
  } else {
    superCoinDoc.coins += coins;
    superCoinDoc.history.push(newHistory);
    await superCoinDoc.save();
  }

  return superCoinDoc;
};

// Redeem coins
exports.redeemCoins = async (req, res) => {
  try {
    const userId = req.user.id;
    const { coinsToRedeem } = req.body;

    const userCoins = await SuperCoinSchema.findOne({ userId });

    if (!userCoins || userCoins.coins < coinsToRedeem) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient coins" });
    }

    userCoins.coins -= coinsToRedeem;
    userCoins.history.push({
      type: "redeem",
      coins: coinsToRedeem,
      description: "Used at checkout",
      createdAt: new Date(),
    });

    await userCoins.save();

    res.json({ success: true, message: "Coins redeemed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
