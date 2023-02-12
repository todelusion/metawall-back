import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { User } from "./userModel";

export class Session {
  // Mongoose populate
  @prop({ ref: () => User })
  user: Ref<User>;

  //  user 登出則狀態為 false
  @prop({ default: true })
  valid: boolean;
}

const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true,
  },
});

export default SessionModel;
