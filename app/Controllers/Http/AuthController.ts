import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import Mail from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const newregister = schema.create({
        nama: schema.string({}, [
          rules.unique({ table: "users", column: "nama" }),
        ]),
        email: schema.string({}, [
          rules.email(),
          rules.unique({ table: "users", column: "email" }),
        ]),
        password: schema.string({}, [rules.minLength(6)]),
        role: schema.enum(["admin", "user"] as const),
      });

      const payload = await request.validate({ schema: newregister });

      const newUSer = await User.create(payload);

      const otp_code = Math.floor(100000 + Math.random() * 900000);
      await Database.table("otp_codes").insert({
        otp_code: otp_code,
        user_id: newUSer.id,
      });

      await Mail.send((message) => {
        message
          .from("info@example.com")
          .to(newUSer.email)
          .subject("Welcome Onboard!")
          .htmlView("emails/otp_verification", { otp_code });
      });

      return response.created({
        message: "register berhasil",
      });
    } catch (error) {
      response.badRequest(error.messages);
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const newLogin = schema.create({
      email: schema.string({}, [rules.email()]),
      password: schema.string(),
    });
    await request.validate({ schema: newLogin });

    const email = request.input("email");
    const password = request.input("password");

    try {
      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "7 days",
      });
      return response.created({
        message: "login berhasil",
        token,
      });
    } catch {
      return response.unauthorized("Invalid login");
    }
  }

  public async me({ auth, response }: HttpContextContract) {
    const user = auth.user;

    return response.ok({
      message: user,
    });
  }

  public async updateProfile({ auth, response, request }: HttpContextContract) {
    const userData = auth.user;

    const profileValidation = schema.create({
      bio: schema.string(),
      alamat: schema.string(),
    });

    await request.validate({ schema: profileValidation });

    const alamat = request.input("alamat");
    const bio = request.input("bio");
    const dataProfile = {
      bio,
      alamat,
    };

    await userData?.related("profile").updateOrCreate({}, dataProfile);

    response.created({
      message: "profil dibuat atau update",
    });
  }

  public async otpConfirm({ request, response }: HttpContextContract) {
    let otp_cod = request.input("otp_code");
    let email = request.input("email");

    let user = await User.findBy("email", email);
    let otpCheck = await Database.query()
      .from("otp_codes")
      .where("otp_code", otp_cod)
      .first();

    if (user?.id == otpCheck.user_id) {
      user.isVerified = true;
      await user?.save();
      return response.status(200).json({ message: "berhasil konfirmasi" });
    } else {
      return response.status(400).json({ message: "gagal" });
    }
  }
}
