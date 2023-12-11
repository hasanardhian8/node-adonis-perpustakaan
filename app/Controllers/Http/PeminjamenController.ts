import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Peminjaman from "App/Models/Peminjaman";

export default class PeminjamenController {
  public async store({ request, response, params, auth }: HttpContextContract) {
    const pinjamValidation = schema.create({
      tanggal_pinjam: schema.string(),
      tanggal_kembali: schema.string(),
    });

    const userId = auth.user?.id;

    await request.validate({ schema: pinjamValidation });

    await Peminjaman.create({
      tanggal_pinjam: request.input("tanggal_pinjam"),
      tanggal_kembali: request.input("tanggal_kembali"),
      user_id: userId,
      buku_id: params.id,
    });

    return response.ok({
      message: "tambah data",
    });
  }

  public async index({ response }: HttpContextContract) {
    const dataPinjam = await Peminjaman.query().preload("user").preload("buku");

    return response.ok({
      message: "berhasil",
      data: dataPinjam,
    });
  }

  public async show({ response, params }: HttpContextContract) {
    const result = await Peminjaman.query()
      .where("id", params.id)
      .preload("user")
      .preload("buku");

    return response.ok({
      message: "berhasil",
      data: result,
    });
  }
}
