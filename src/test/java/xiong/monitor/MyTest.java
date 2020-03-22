package xiong.monitor;

import org.junit.jupiter.api.Test;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class MyTest {

    @Test
    void testHash() throws NoSuchAlgorithmException {
        String originStr = "123456";
        byte[] pwdBytes = originStr.getBytes();
        byte[] encodeBytes = MessageDigest.getInstance("md5").digest(pwdBytes);
        // String encodePwd = encodeBytes.toString();
        String encodePwd = Base64.getEncoder().encodeToString(encodeBytes);

        // Base64.getDecoder().decode(encodePwd)
        System.out.println(encodePwd);
    }
}
