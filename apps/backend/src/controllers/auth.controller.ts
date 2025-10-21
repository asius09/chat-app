export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    // Accept refresh token from body or header
    const refreshToken =
      (req.body && req.body.refreshToken) ||
      (req.headers['x-refresh-token'] as string) ||
      '';

    if (!refreshToken || typeof refreshToken !== 'string') {
      return res
        .status(400)
        .json(ResponseBuilder.fail('No refresh token provided'));
    }

    const newAccessToken = refreshAccessToken(refreshToken);
    if (!newAccessToken) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Invalid or expired refresh token'));
    }

    res
      .status(200)
      .json(ResponseBuilder.ok({ token: newAccessToken }, 'Token refreshed'));
  } catch (err) {
    next(err);
  }
}
