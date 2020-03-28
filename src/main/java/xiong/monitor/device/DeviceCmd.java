package xiong.monitor.device;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import xiong.monitor.entity.Device;

@Component
public class DeviceCmd {
    RestTemplate restTemplate = new RestTemplate();

    public void addDevice(Long deviceId) {
        restTemplate.exchange("http://localhost:1999/device/add?deviceId=" + deviceId, HttpMethod.POST, null, String.class);
    }

    public void delDevice(Long deviceId) {
        restTemplate.exchange("http://localhost:1999/device/add?deviceId=" + deviceId, HttpMethod.POST, null, String.class);
    }
}
