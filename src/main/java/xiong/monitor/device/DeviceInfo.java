package xiong.monitor.device;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
class DeviceSrc {
  private Long index;
  private String uri;
  private Integer processType;
}

@Data
@AllArgsConstructor
class DeviceInfo {
  private List<DeviceSrc> sources;
  private String hlsDir;
  private Integer processType;
}
