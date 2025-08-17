const mongoose = require("mongoose");

const connectionRequestSchema =
  new mongoose.SchemaType({
    fronmUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: [],
    },
  });
