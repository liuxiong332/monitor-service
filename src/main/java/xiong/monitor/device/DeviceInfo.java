package xiong.monitor.device;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
class DeviceSrc {
  private Integer deviceId;
  private String deviceName;
  private String deviceIP;
  private String videoPath;
  private String scene;
  private String modelPath;
}

@Data
@AllArgsConstructor
class DeviceInfo {
  private List<DeviceSrc> source;
}
