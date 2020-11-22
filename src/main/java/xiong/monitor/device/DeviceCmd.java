package xiong.monitor.device;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import xiong.monitor.entity.Device;
import xiong.monitor.mapper.DeviceMapper;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DeviceCmd {
  private RestTemplate restTemplate = new RestTemplate();

  @Autowired private DeviceMapper deviceMapper;

  @Value("${VIDEO_OUTPUT_PATH:/home/xiong.liu/object-detection/nginx/data/videos}")
  private String videoPath;

  @Value("${DETECT_SERVICE_HOST:12.168.1.161}")
  private String detectServiceHost;

  @Value("${DETECT_SERVICE_PORT:8004}")
  private Long detectServicePort;

  public void updateDevices() {
    List<Device> devices = deviceMapper.selectList(new QueryWrapper<>());
    List<DeviceSrc> srcs =
        devices.stream()
            .map(
                device ->
                    new DeviceSrc(
                        device.getDeviceId(), device.getServiceUrl(), device.getDeviceType()))
            .collect(Collectors.toList());
    DeviceInfo deviceInfo = new DeviceInfo(srcs, videoPath, 0);

    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<DeviceInfo> httpEntity = new HttpEntity<>(deviceInfo, httpHeaders);

    //String url = String.format("http://%s:%d/api/ds/deploy", detectServiceHost, detectServicePort);
    //ResponseEntity<Object> responseEntity =
    //    restTemplate.exchange(url, HttpMethod.POST, httpEntity, Object.class);
    //System.out.println("Update the device info to remote service with " + deviceInfo);
    //System.out.println("Remote service response with " + responseEntity.getBody());
  }
}
