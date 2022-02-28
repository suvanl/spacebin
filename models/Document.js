import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    }
});

export default mongoose.model("Document", documentSchema);
