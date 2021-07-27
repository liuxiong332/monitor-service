package xiong.monitor.config;

import org.apache.commons.net.PrintCommandListener;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import sun.net.ftp.FtpReplyCode;

import javax.annotation.PostConstruct;
import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

@Component
public class FtpClient {
    @Value("${alarmInfo.ftpIP}")
    String ftpIP;

    @Value("${alarmInfo.ftpPort}")
    Integer ftpPort;

    @Value("${alarmInfo.ftpUser}")
    String ftpUser;

    @Value("${alarmInfo.ftpPwd}")
    String ftpPwd;

    @Value("${alarmInfo.alarmPath}")
    String alarmPath;

    @Value("${alarmInfo.filePath}")
    String filePath;

    private FTPClient ftp;

    void init() throws IOException {
        ftp = new FTPClient();

        ftp.addProtocolCommandListener(new PrintCommandListener(new PrintWriter(System.out)));

        ftp.connect(ftpIP, ftpPort);

        ftp.login(ftpUser, ftpPwd);

        FTPFile[] files = ftp.listFiles();
        System.out.println(Arrays.stream(files).map(FTPFile::getName).collect(Collectors.toList()));
    }

    public String uploadFile(String fileName, InputStream ins) throws IOException {
        String newFilePath = Paths.get(filePath, fileName).toString();
        ftp.storeFile(newFilePath, ins);
        return newFilePath;
    }

    public String uploadAlarmFile(String fileName, String ins) throws IOException {
        String newFilePath = Paths.get(alarmPath, fileName).toString();
        ftp.storeFile(newFilePath, new ByteArrayInputStream(ins.getBytes(StandardCharsets.UTF_8)));
        return newFilePath;
    }
}
