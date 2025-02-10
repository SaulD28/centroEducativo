import {Schema, model} from "mongoose"

const userSchema = Schema({
    name:{
        type: String,
        required: [true, "El nombre es requerido"],
        maxLength:[25, "El nombre no puede excederse de los 25 caracteres"]
    },
    surname:{
        type: String,
        required: [true, "El nombre es requerido"],
        maxLength:[25, "El nombre no puede excederse de los 25 caracteres"]        
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minLength: 8
    },
    email:{
        type:String,
        required:[true, "El correo es requerido"],
        unique: true
    },
    phone:{
        type: String,
        minLength: 8,
        mixLength: 8,
        required: true
    },
    role: {
        type: String,
        require: true,
        enum: ["STUDENT_ROLE", "TEACHER_ROLE"],
        default: "STUDENT_ROLE"
    },
    status:{
        type: Boolean,
        default: true
    },
    assignedCourses: {
        type: [{type: Schema.Types.ObjectId, ref: "Course"}],
        validate: [
            (val) => val.length <= 3,
            ""
        ],
    }
},
    {
        versionKey: false,
        timeStamps: true

})

userSchema.methods.toJSON = function(){
    const {password, _id, ...user} = this.toObject()
    user.uid = _id
    return user
}

export default model("User", userSchema);
