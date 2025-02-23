import mongoose from "mongoose";

const userReportsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    reportUrl: { type: String },
    summary: { type: String },
});

const userReportsModel =
    mongoose.models.userReports ||
    mongoose.model("userreports", userReportsSchema);
export default userReportsModel;
