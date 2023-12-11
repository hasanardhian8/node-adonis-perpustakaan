import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Profile from "./Profile";
import Buku from "./Buku";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken: string | null;

  @column()
  public nama: string;

  @column()
  public role: string;

  @column()
  public is_verified: boolean | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @hasOne(() => Profile, {
    foreignKey: "user_id",
  })
  public profile: HasOne<typeof Profile>;

  @manyToMany(() => Buku, {
    localKey: "id",
    pivotForeignKey: "user_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "buku_id",
    pivotTable: "peminjamen",
  })
  public pinjamus: ManyToMany<typeof Buku>;
}
