const { database, ref: dbRef, get, update, set } = require("../database/conn");
const {
  getStorage,
  ref: storageRef,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const admin = require("firebase-admin");
const { auth } = require("firebase-admin");

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const userRef = dbRef(database, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      res.status(200).json(userData);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserById = async (req, res) => {
  const userId = req.params.userId;
  const updates = req.body;
  try {
    const userRef = dbRef(database, `users/${userId}`);
    await update(userRef, updates);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user data", error });
  }
};

const uploadAvatar = async (req, res) => {
  const userId = req.params.userId;
  const file = req.file;
  try {
    const storage = getStorage();
    const storageReference = storageRef(
      storage,
      `avatars/${userId}/${file.originalname}`
    );

    // Set metadata for the file
    const metadata = {
      contentType: file.mimetype,
    };

    await uploadBytes(storageReference, file.buffer, metadata);
    const downloadURL = await getDownloadURL(storageReference);

    const userRef = dbRef(database, `users/${userId}`);
    await update(userRef, { avatar: downloadURL });

    res.status(200).json({ avatar: downloadURL });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ message: "Error uploading avatar", error });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const userRef = dbRef(database, "users");
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      res.status(200).json(userData);
    } else {
      res.status(404).json({ error: "Users not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRefundMoneyByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userRef = dbRef(database, `users/${userId}/refundMoney`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      res.status(200).json(userData);
    } else {
      res.status(404).json({ error: "Refund not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateRefundMoneyByUserId = async (req, res) => {
  const userId = req.params.userId;
  const refundKey = req.params.refundKey;
  const updates = req.body;
  try {
    const userRef = dbRef(database, `users/${userId}/refundMoney/${refundKey}`);
    await update(userRef, updates);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user data", error });
  }
};

const updatePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).send("Error: Missing token or newPassword");
  }

  try {
    const db = admin.database();
    const tokenSnapshot = await db.ref('passwordResetTokens').orderByChild('token').equalTo(token).once('value');

    if (!tokenSnapshot.exists()) {
      return res.status(400).send("Error: Invalid or expired token");
    }

    const resetToken = Object.values(tokenSnapshot.val())[0];
    if (resetToken.expires <= Date.now()) {
      return res.status(400).send("Error: Token has expired");
    }

    const userEmail = resetToken.email;
    const userRecord = await admin.auth().getUserByEmail(userEmail);

    await admin.auth().updateUser(userRecord.uid, { password: newPassword });

    const tokenKey = Object.keys(tokenSnapshot.val())[0];
    await db.ref(`passwordResetTokens/${tokenKey}`).remove();

    res.send("Password updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error: ${error.message}`);
  }
};


module.exports = {
  getUserById,
  updateUserById,
  uploadAvatar,
  getAllUsers,
  getRefundMoneyByUserId,
  updateRefundMoneyByUserId,
  updatePassword,
};
