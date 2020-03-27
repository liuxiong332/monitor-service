package xiong.monitor.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;
import xiong.monitor.entity.User;
import xiong.monitor.exception.InvalidParamException;
import xiong.monitor.exception.UnauthorizatedException;
import xiong.monitor.mapper.UserMapper;
import xiong.monitor.util.JWTUtil;
import xiong.monitor.util.OutputResult;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Data
class LoginInfoData {
  String username;
  String password;
}

@Data
class SignUpInfoData {
  String username;
  String password;
  String email;
  String verificationCode;
}

@Data
class SignInReturnData {
  final String token;
}

@RestController
public class UserLoginController {

  @Autowired private UserMapper userMapper;

  @Autowired private RedisTemplate<String, Object> redisTemplate;

  @Autowired private JavaMailSender mailSender;

  private Logger logger = LoggerFactory.getLogger(UserLoginController.class);

  @PostMapping("/sendVerifyCode")
  OutputResult<Object> sendVerifyCode(@RequestParam String email) throws MessagingException {
    int randomNum = (int) Math.floor(Math.random() * 1000000);
    String numStr = String.format("%06d", randomNum);
    System.out.println(String.format("For email %s, get verification code %s", email, numStr));

    redisTemplate.opsForValue().set("code." + email, numStr);
    redisTemplate.expire("code." + email, 5, TimeUnit.MINUTES);

    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper messageHelper = new MimeMessageHelper(message);

    messageHelper.setFrom("liuxiong332@163.com");
    messageHelper.setTo(email);
    messageHelper.setSubject("验证码");
    messageHelper.setText("<div>您的验证码是<strong>" + numStr + "</strong>，5分钟内有效</div>", true);

    mailSender.send(message);
    // request.getSession().setAttribute("email", email);
    // request.getSession().setAttribute("verificationCode", numStr);
    return new OutputResult<>(null);
  }

  @PostMapping("/signUp")
  OutputResult<SignInReturnData> signUp(@RequestBody SignUpInfoData loginInfo) {
    if (loginInfo.getEmail() == null) {
      throw new InvalidParamException("The email is not valid.");
    }

    String existCode = (String) redisTemplate.opsForValue().get("code." + loginInfo.getEmail());

    if (existCode == null
        || loginInfo.getVerificationCode() == null
        || !existCode.equals(loginInfo.getVerificationCode())) {
      throw new InvalidParamException("The verification is not valid.");
    }

    User user = new User();
    user.setName(loginInfo.getUsername());
    // 对密码进行md5哈希
    String password = loginInfo.getPassword();
    try {
      byte[] originPwd = password.getBytes();
      byte[] hashPwd = MessageDigest.getInstance("md5").digest(originPwd);
      String pwdStr = Base64.getEncoder().encodeToString(hashPwd);
      user.setPassword(pwdStr);
    } catch (NoSuchAlgorithmException e) {
      System.err.println(e);
    }

    user.setEmail(loginInfo.getEmail());
    user.setCreateTime(new Date());
    user.setUpdateTime(new Date());
    userMapper.insert(user);
    assert user.getUserId() != null;

    String token = JWTUtil.sign(user.getUserId().toString(), "123456");
    // request.getSession().setAttribute("loginUser", user.getId());
    // request.getSession().setAttribute("username", loginInfo.);
    return new OutputResult<SignInReturnData>(new SignInReturnData(token));
  }

  @PostMapping("/login")
  OutputResult<SignInReturnData> login(@RequestBody LoginInfoData loginInfo) {
    String username = loginInfo.getUsername();

    String encodePwd = "";
    try {
      byte[] pwdBytes = loginInfo.getPassword().getBytes();
      byte[] encodeBytes = MessageDigest.getInstance("md5").digest(pwdBytes);
      encodePwd = Base64.getEncoder().encodeToString(encodeBytes);
    } catch (NoSuchAlgorithmException e) {
      System.err.println(e);
    }

    QueryWrapper<User> wrapper = new QueryWrapper<User>();
    wrapper.eq("name", loginInfo.getUsername());
    logger.info("select user sql {}", wrapper.getSqlSegment());
    User user = userMapper.selectOne(wrapper);

    if (user == null || !user.getPassword().equals(encodePwd)) {
      throw new UnauthorizatedException("Username or password is incorrect");
    }

    String token = JWTUtil.sign(user.getUserId().toString(), "123456");
    return new OutputResult<SignInReturnData>(new SignInReturnData(token));
  }
}
