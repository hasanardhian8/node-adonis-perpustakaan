import { HttpContext } from "@adonisjs/core/build/standalone";
import Route from "@ioc:Adonis/Core/Route";
import Database from "@ioc:Adonis/Lucid/Database";

Route.get("/", async ({ response }: HttpContext) => {
  const perpus = await Database.from("perpustakaan");
  return response.json({
    data: {
      perpus: perpus,
    },
  });
});

Route.group(() => {
  Route.resource("kategori", "KategorisController").middleware({
    "*": ["auth", "admin"],
  });
  Route.resource("buku", "BukusController").middleware({
    "*": ["auth", "admin"],
  });
  //peminjaman
  Route.post("buku/:id/peminjaman", "PeminjamenController.store").middleware(
    "auth"
  );
  Route.get("listbuku", "BukusController.index").middleware("auth");
  Route.get("listkategori", "KategorisController.index").middleware("auth");
  Route.get("peminjaman", "PeminjamenController.index").middleware("auth");
  Route.get("peminjaman/:id", "PeminjamenController.show").middleware("auth");
}).prefix("/api/v1");

//auth
Route.group(() => {
  Route.post("/register", "AuthController.register");
  Route.post("/login", "AuthController.login");
  Route.get("/me", "AuthController.me").middleware("auth");

  Route.post("profile", "AuthController.updateProfile").middleware("auth");
  Route.post("verifikasi-otp", "AuthController.otpConfirm").as(
    "auth.otpVerify"
  );
}).prefix("/api/v1/auth");
