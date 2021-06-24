package xiong.monitor.push;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Lists;
import com.obs.services.ObsClient;
import com.obs.services.ObsConfiguration;
import org.apache.commons.io.FileUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import xiong.monitor.entity.Device;
import xiong.monitor.entity.EventCounter;
import xiong.monitor.entity.EventRecord;
import xiong.monitor.mapper.DeviceMapper;
import xiong.monitor.mapper.EventCounterMapper;
import xiong.monitor.mapper.EventRecordMapper;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class ImproperPusher {
    Logger logger = LoggerFactory.getLogger(ImproperPusher.class);

    @Value("${deploy.code}")
    String deployCode;

    @Value("${obs.access-key}")
    String accessKey;

    @Value("${obs.secret-key}")
    String secretKey;

    @Value("${obs.bucket}")
    String obsBucket;

    @Value("${video.transfer-server}")
    String videoTransferServer;

    @Autowired
    KafkaTemplate<String, String> template;

    @Autowired
    EventCounterMapper eventCounterMapper;

    ObsClient obsClient;

    @Autowired
    EventRecordMapper eventRecordMapper;

    @Autowired
    DeviceMapper deviceMapper;

    @PostConstruct
    void init() {
        obsClient = new ObsClient(accessKey, secretKey, "obs.cn-north-1.myhuaweicloud.com");
    }

    public int genTodayCounter(String todayStr) {
        QueryWrapper<EventCounter> query = new QueryWrapper<>();
        query.eq("event_day", todayStr);

        EventCounter item = eventCounterMapper.selectOne(query);
        int todayCounter;
        if (item == null) {
            eventCounterMapper.insert(new EventCounter(null, todayStr, 1));
            todayCounter = 1;
        } else {
            QueryWrapper<EventCounter> selectQuery = new QueryWrapper<>();
            selectQuery.eq("event_day", todayStr);
            selectQuery.eq("counter", item.getCounter());
            eventCounterMapper.update(new EventCounter(null, todayStr, item.getCounter() + 1), selectQuery);
            todayCounter = item.getCounter() + 1;
        }
        return todayCounter;
    }

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

    String formatDate(String format, Date date) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        dateFormat.setTimeZone(TimeZone.getTimeZone(ZoneId.of("Asia/Shanghai")));
        return dateFormat.format(date);
    }

    String genEventId(Date date) {
        String todayStr = formatDate("yyyy-MM-dd", date);
        int todayCounter = genTodayCounter(todayStr);

        return String.format("%s-%d", todayStr, todayCounter).replace("-", "");
    }

    public String transferFile(String localFilePath) throws IOException {
        logger.info("Will transfer file path {}", localFilePath);

        HttpClient httpClient = HttpClients.createDefault();

        HttpGet httpGet = new HttpGet(String.format("http://%s/?path=%s", videoTransferServer, localFilePath));

        HttpResponse response = httpClient.execute(httpGet);

        String transferPath = EntityUtils.toString(response.getEntity());

        logger.info("Done transfer file path {}", transferPath);

        return transferPath;
    }

    public void transferAndSendEvent(String localFilePath) throws Exception {
        String transferPath = transferFile(localFilePath);
        sendEvent(Collections.singletonList(transferPath), null);
    }

    public void transferAndSendEvent(List<String> localFilePath, Integer deviceIndex) throws Exception {
        List<String> transferPath = localFilePath.stream().map(fp -> {
            try {
                return transferFile(fp);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        }).filter(Objects::nonNull).collect(Collectors.toList());
        sendEvent(transferPath, deviceIndex);
    }

    InputStream downloadFromPath(String remoteUrl) throws IOException {
        HttpClient httpClient = HttpClients.createDefault();

        HttpGet httpGet = new HttpGet("http://localhost:9000" + remoteUrl);

        HttpResponse response = httpClient.execute(httpGet);

        return response.getEntity().getContent();
    }

    public void sendEvent(List<String> remotePaths, Integer deviceIndex) throws Exception {
        Date currentDate = new Date();
        String eventId = genEventId(currentDate);

        // 查找deviceIndex对应的 device
        Device device = null;
        if (deviceIndex != null) {
            List<Device> devices = deviceMapper.selectList(new QueryWrapper<>());
            List<Device> filterDevices = devices.stream().filter(d -> !d.getName().equals("驾驶员接打电话检测")).collect(Collectors.toList());
            if (deviceIndex >= 0 && deviceIndex < filterDevices.size()) {
                device = filterDevices.get(deviceIndex);
            }
        }

        // 获取device对应的场景
        String alartType = "driver_call";
        if (device != null) {
            switch (device.getDeviceType()) {
                case 1: alartType = "without_helmet"; break;
                case 2: alartType = "control_room"; break;
                case 3: alartType = "vehicle_intrusion"; break;
                case 4: alartType = "driver_call"; break;
            }
        }

        ArrayList<String> fileNames = new ArrayList<>();
        for (String remotePath: remotePaths) {
            try (InputStream is = downloadFromPath(remotePath)) {
                logger.info("Will upload file {} to OBS", remotePath);
                String extension = remotePath.substring(remotePath.lastIndexOf("."));
                fileNames.add(uploadFile(currentDate, is, extension, alartType));
                logger.info("Done upload file {} to OBS", remotePath);
            }
        }

        logger.info("Will save event");
        eventRecordMapper.insert(new EventRecord(eventId, currentDate, String.join(",", remotePaths), device != null ? device.getDeviceId() : null, device != null ? device.getDeviceType() : null, ""));
        logger.info("Done save event");

        logger.info("Will send event to kafka");

        String finalAlartType = alartType;
        template.send("risk-safe-behavior-violation-file-info", new ObjectMapper().writeValueAsString(new HashMap<String, Object>() {{
            this.put("eventId", eventId);
            this.put("fileNames", fileNames);
            this.put("mineCode", deployCode);
            this.put("alarmType", finalAlartType);
            this.put("date", formatDate("yyyy-MM-dd HH:mm:ss", currentDate));
            this.put("cameraId", 1);
            this.put("cameraName", "001号卡车");
        }}));
        logger.info("Done send event to kafka");
    }

//    @KafkaListener(topics = "risk-safe-behavior-violation-file-info", id = "test-server")
//    void consumer(String in) {
//        System.out.println(in);
//    }
}
