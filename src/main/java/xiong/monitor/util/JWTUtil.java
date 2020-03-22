package xiong.monitor.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Date;

public class JWTUtil {
  private static final long EXPIRE_TIME = 24 * 60 * 60 * 1000;

  public static boolean verify(String token, String username, String secret) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      JWTVerifier verifier = JWT.require(algorithm).withClaim("username", username).build();
      verifier.verify(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  public static String getUserName(String token) {
    try {
      DecodedJWT jwt = JWT.decode(token);
      return jwt.getClaim("username").asString();
    } catch (JWTDecodeException e) {
      return null;
    }
  }

  public static String sign(String username, String secret) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      return JWT.create()
          .withClaim("username", username)
          .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRE_TIME))
          .sign(algorithm);
    } catch (IllegalArgumentException e) {
      return null;
    }
  }
}
