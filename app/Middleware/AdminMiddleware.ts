import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AdminMiddleware {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const userAdmin = auth.user?.role === "admin";

    if (userAdmin) {
      await next();
    } else {
      response.unauthorized({
        message: "anda bukan admin",
      });
    }
  }
}
