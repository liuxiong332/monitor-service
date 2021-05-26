package xiong.monitor;

import org.junit.jupiter.api.Test;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.Base64;
import java.util.Date;
import java.util.TimeZone;

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

    @Test
    void dateTest() {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        format.setTimeZone(TimeZone.getTimeZone(ZoneId.of("Asia/Shanghai")));
        System.out.println(format.format(new Date()));
    }
}
