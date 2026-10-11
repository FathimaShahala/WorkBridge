const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  type = "system",
  title,
  message,
  link = "",
}) => {
  try {
    if (!recipient || !title || !message) {
      console.error(
        "Notification creation failed: missing required fields."
      );
      return null;
    }

    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      link,
    });

    return notification;
  } catch (error) {
    console.error(
      "Create Notification Error:",
      error
    );

    return null;
  }
};

module.exports = createNotification;