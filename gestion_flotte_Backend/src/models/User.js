import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserShema = new mongoose.Schema(
    {
        nom:{ type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true
        },
        motDePasse: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["admin", "chauffeur"]
        },
    },{timestamps : true});

    UserShema.pre("save", async function (){
        if(!this.isModified("motDePasse")) return;

        this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
    });

    UserShema.methods.comparePassword = async function (password){
        return await bcrypt.compare(password, this.motDePasse);
    }

    const User = mongoose.model("User", UserShema);

    export default User;