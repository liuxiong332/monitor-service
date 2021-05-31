package xiong.monitor.device;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import xiong.monitor.entity.AIModel;
import xiong.monitor.entity.Device;
import xiong.monitor.entity.Scene;
import xiong.monitor.mapper.DeviceMapper;
import xiong.monitor.mapper.ModelMapper;
import xiong.monitor.mapper.SceneMapper;
import xiong.monitor.util.ModelPaths;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class DeviceCmd {
    private Logger logger = LoggerFactory.getLogger(DeviceCmd.class);

    private RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private DeviceMapper deviceMapper;

    @Autowired
    private SceneMapper sceneMapper;

    @Autowired
    private ModelMapper modelMapper;

    @Value("${VIDEO_OUTPUT_PATH:/home/xiong.liu/object-detection/nginx/data/videos}")
    private String videoPath;

    @Value("${DETECT_SERVICE_HOST:12.168.1.161}")
    private String detectServiceHost;

    @Value("${DETECT_SERVICE_PORT:8004}")
    private Long detectServicePort;

    @Value("${video.transfer-server}")
    String videoTransferServer;

    static HashMap<String, String> SceneNameMap = new HashMap<String, String>() {{
        this.put("未戴安全帽检测", "helmetIdentify");
        this.put("离岗检测", "leaveCheck");
        this.put("车辆入侵检测", "carCheck");
        this.put("驾驶员接打电话检测", "phoneCheck");
    }};

    public void updateDevices() {
        List<Device> devices = deviceMapper.selectList(new QueryWrapper<>());
        List<DeviceSrc> srcs = devices.stream()
            .map(device -> {
                Optional<Scene> scene = Optional.ofNullable(sceneMapper.selectById(device.getDeviceType()));
                if (scene.isPresent() && scene.get().getName().equals("未戴安全帽检测")) {
                    Optional<AIModel> model = scene.flatMap(s -> Optional.ofNullable(s.getModelId()))
                        .flatMap(id -> Optional.ofNullable(modelMapper.selectById(id)));
                    return new DeviceSrc(
                        device.getDeviceId(),
                        // device.getName(),
                        device.getDeviceId().toString(),
                        device.getServiceUrl(),
                        device.getPath(),
                        scene.map(Scene::getName).map(name -> SceneNameMap.getOrDefault(name, "")).orElse(null),
                        model.flatMap(m -> Optional.ofNullable(m.getModelPath()).map(ModelPaths::getModelDir)).orElse(null)
                    );
                } else {
                    return null;
                }
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());

        logger.info("Upload devices to {}", srcs);

         DeviceInfo deviceInfo = new DeviceInfo(srcs);

         HttpHeaders httpHeaders = new HttpHeaders();
         httpHeaders.setContentType(MediaType.APPLICATION_JSON);
         HttpEntity<DeviceInfo> httpEntity = new HttpEntity<>(deviceInfo, httpHeaders);


        String url = String.format("http://%s/startDS", videoTransferServer);
        ResponseEntity<String> responseEntity =
            restTemplate.exchange(url, HttpMethod.POST, httpEntity, String.class);
        // logger.info("Update the device info to remote service with " + deviceInfo);
        logger.info("Remote service response with " + responseEntity.getBody());
    }
}
