import { getModelForClass, index, pre, prop } from "@typegoose/typegoose";
import { Severity } from "@typegoose/typegoose/lib/internal/constants";
import { modelOptions } from "@typegoose/typegoose/lib/modelOptions";
import { DocumentType } from "@typegoose/typegoose/lib/types";
import { hash, verify } from "argon2";
import { nanoid } from "nanoid";

/* --- @pre --- */
// 1. 同 mongoose "pre" hooks
// 2. 於用戶建立/修改 User document 的時間點介入，將密碼 hash 化後才存入 DB
// 3. <User> 泛型用於定義 this （本處指向 document）的型別
@pre<User>("save", async function () {
  if (!this.isModified("password")) return;

  const hashPassword = await hash(this.password);

  // 將 hash 後的 password 放入 user document (this)
  this.password = hashPassword;
})
/* --- @index  --- */
// 提升以 email 作為索引的查詢效能
@index({ email: 1 })
/* --- model 設定項 --- */
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    // 密碼重設碼同時有 string 以及 null 兩種型別，因此啟用 allowMixed
    allowMixed: Severity.ALLOW,
  },
})

/* --- model 結構 --- */
export class User {
  // unique 是否唯一，若有重複的資料則報 11000 錯誤
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop()
  nickname: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  // 寄出密碼重設信且過一段時間後，passwordResetCode 將被重設為 null，防止用戶使用舊的 reset code 來更改密碼
  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  // methods
  async validatePassword(
    this: DocumentType<User>,
    candidatePassword: string
  ): Promise<boolean> {
    try {
      return await verify(this.password, candidatePassword);
    } catch (error) {
      console.error(error, "can't validate password");
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
