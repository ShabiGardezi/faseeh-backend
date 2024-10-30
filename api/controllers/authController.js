const AuthService = require("../services/authService");

class AuthController {
  static async signUpUser(req, res, next) {
    try {
      const result = await AuthService.signUp(req);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async loginUser(req, res, next) {
    try {
      const result = await AuthService.login(req);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async googleLoginUser(req, res, next) {
    try {
      const result = await AuthService.googleLogin(req);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async verifyToken(req, res, next) {
    try {
      const result = await AuthService.verifyToken(req);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
  static async resetPasswordRequest(req, res, next) {
    try {
      const result = await AuthService.resetPasswordRequest(req);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const result = await AuthService.resetPassword(req);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
