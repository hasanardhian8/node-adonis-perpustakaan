import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Buku from "App/Models/Buku";

export default class BukusController {
  public async index({ response }) {
    const result = await Buku.query().preload("kategori").preload("pinjambuku");

    return response.ok({
      message: "tampil",
      data: result,
    });
  }

  public async store({ request, response }) {
    const result = schema.create({
      judul: schema.string(),
      ringkasan: schema.string(),
      tahun_terbit: schema.string(),
      halaman: schema.number(),
      kategori_id: schema.number([
        rules.exists({ table: "kategoris", column: "id" }),
      ]),
    });

    const payload = await request.validate({ schema: result });

    await Buku.create(payload);

    return response.ok({
      message: "berhasil",
    });
  }

  public async show({ response, params }: HttpContextContract) {
    const result = await Buku.query()
      .where("id", params.id)
      .preload("kategori");

    return response.ok({
      message: "berhasil",
      data: result,
    });
  }

  public async update({ response, params, request }: HttpContextContract) {
    const upresult = schema.create({
      judul: schema.string.optional(),
      ringkasan: schema.string.optional(),
      tahun_terbit: schema.string.optional(),
      halaman: schema.number.optional(),
      kategori_id: schema.number.optional([
        rules.exists({ table: "kategoris", column: "id" }),
      ]),
    });

    const uppayload = await request.validate({ schema: upresult });

    const result = await Buku.query().where("id", params.id).update(uppayload);
    /*
    const result = awwait buku.findorfail(params.id)
    result.judul = uppayload.judul
    result.ringkasan = uppayload.ringkasan
    result.tahun_terbit = uppayload.tahun_terbit
    result.halaman = uppayload.halaman
    result.kategori_id = uppayload.kategori_id

    await buku.save()
*/

    return response.ok({
      message: "berhasil",
      data: result,
    });
  }

  public async destroy({ response, params }: HttpContextContract) {
    const result = (await Buku.findOrFail(params.id)).delete();

    return response.ok({
      message: "data terdelete",
      data: result,
    });
  }
}
