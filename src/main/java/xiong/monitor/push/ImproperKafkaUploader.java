package xiong.monitor.push;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.obs.services.ObsClient;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.TimeZone;

public class ImproperKafkaUploader implements ImproperUploader {
    Logger logger = LoggerFactory.getLogger(ImproperKafkaUploader.class);

    ObsClient obsClient;
    String deployCode;
    String obsBucket;

    KafkaTemplate<String, String> template;

    ImproperKafkaUploader(KafkaTemplate<String, String> template, String deployCode, String obsBucket, String accessKey, String secretKey) {
        this.deployCode = deployCode;
        this.obsBucket = obsBucket;
        this.template = template;
        obsClient = new ObsClient(accessKey, secretKey, "obs.cn-north-1.myhuaweicloud.com");
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

        String fileType = "image";
        if (extension.equals(".mp4")) {
            fileType = "video";
        }

        String todayStr = formatDate("yyyy-MM-dd", date);
        String obsPath = String.format("%s/%s/%s/%s/%s", deployCode, todayStr, alartType, fileType, fileName);
        logger.info("Will put file to OBS path {}", obsPath);
        obsClient.putObject(obsBucket, obsPath, ins);

        // FileUtils.copyInputStreamToFile(obsClient.getObject(obsBucket, obsPath).getObjectContent(), new File("item.png"));

        return fileName;
    }

    @SneakyThrows
    @Override
    public void uploadAlart(Date date, String alartType, String eventId, List<String> fileNames) {
        logger.info("Will send event to kafka");

        template.send("risk-safe-behavior-violation-file-info", new ObjectMapper().writeValueAsString(new HashMap<String, Object>() {{
            this.put("eventId", eventId);
            this.put("fileNames", fileNames);
            this.put("mineCode", deployCode);
            this.put("alarmType", alartType);
            this.put("date", formatDate("yyyy-MM-dd HH:mm:ss", date));
            this.put("cameraId", 1);
            this.put("cameraName", "001号卡车");
        }}));
        logger.info("Done send event to kafka");
    }
}
