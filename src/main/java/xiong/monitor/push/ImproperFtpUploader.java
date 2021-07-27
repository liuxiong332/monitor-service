package xiong.monitor.push;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.obs.services.ObsClient;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import xiong.monitor.config.FtpClient;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.TimeZone;

public class ImproperFtpUploader implements ImproperUploader {
    Logger logger = LoggerFactory.getLogger(ImproperFtpUploader.class);

    String deployCode;

    FtpClient ftpClient;

    ImproperFtpUploader(FtpClient ftpClient, String deployCode) {
        this.deployCode = deployCode;
        this.ftpClient = ftpClient;
    }

    String formatDate(String format, Date date) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        dateFormat.setTimeZone(TimeZone.getTimeZone(ZoneId.of("Asia/Shanghai")));
        return dateFormat.format(date);
    }

    @Override
    public String uploadFile(Date date, InputStream ins, String extension, String alartType) throws IOException {
        String dateStr = formatDate("yyyyMMddHHmmss", date);
        String fileName = String.format("%s%s", dateStr, extension);

        String ftpPath = ftpClient.uploadFile(fileName, ins);
        logger.info("Done put file to Ftp path {}", ftpPath);
        // FileUtils.copyInputStreamToFile(obsClient.getObject(obsBucket, obsPath).getObjectContent(), new File("item.png"));

        return fileName;
    }

    @SneakyThrows
    @Override
    public void uploadAlart(Date date, String alartType, String eventId, List<String> fileNames) {
        logger.info("Will send event to ftp");

        String dateStr = formatDate("yyyyMMddHHmmss", date);
        String fileName = String.format("%s_%s_%s.json", deployCode, alartType, dateStr);

        ftpClient.uploadAlarmFile(fileName, new ObjectMapper().writeValueAsString(new HashMap<String, Object>() {{
            this.put("eventId", eventId);
            this.put("fileNames", fileNames);
            this.put("mineCode", deployCode);
            this.put("alarmType", alartType);
            this.put("date", formatDate("yyyy-MM-dd HH:mm:ss", date));
            this.put("cameraId", 1);
            this.put("cameraName", "001号卡车");
        }}));
        logger.info("Done send event to ftp");
    }
}
