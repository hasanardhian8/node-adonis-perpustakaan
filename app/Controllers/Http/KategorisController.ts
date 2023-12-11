import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Kategori from "App/Models/Kategori";

export default class KategorisController {
  public async index({ response }) {
    const result = await Kategori.query().preload("buku");

    return response.ok({
      message: "tampil",
      data: result,
    });
  }

  public async store({ request, response }) {
    const result = schema.create({
      nama: schema.string(),
    });

    const payload = await request.validate({ schema: result });

    await Kategori.create(payload);

    return response.ok({
      message: "berhasil",
    });
  }

  public async show({ response, params }: HttpContextContract) {
    const result = await Kategori.query()
      .where("id", params.id)
      .preload("buku");

    return response.ok({
      message: "berhasil",
      data: result,
    });
  }

  public async update({ response, params, request }: HttpContextContract) {
    const upresult = schema.create({
      nama: schema.string(),
    });

    const uppayload = await request.validate({ schema: upresult });

    const result = await Kategori.query()
      .where("id", params.id)
      .update(uppayload);

    return response.ok({
      message: "berhasil",
      data: result,
    });
  }
  public async destroy({ response, params }: HttpContextContract) {
    const result = (await Kategori.findOrFail(params.id)).delete();

    return response.ok({
      message: "data terdelete",
      data: result,
    });
  }
}
