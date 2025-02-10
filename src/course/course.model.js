import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      maxLength: [100, "Course title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher is required"],
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

courseSchema.methods.toJSON = function () {
  const { __v, _id, ...course } = this.toObject();
  course.uid = _id;
  return course;
};

export default model("Course", courseSchema);
