package xiong.monitor.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.google.common.collect.Lists;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xiong.monitor.device.DeviceCmd;
import xiong.monitor.entity.Device;
import xiong.monitor.mapper.DeviceMapper;
import xiong.monitor.push.ImproperPusher;
import xiong.monitor.util.OutputResult;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
class AppController {

  @Autowired
  private ImproperPusher improperPusher;

  private Logger logger = LoggerFactory.getLogger(AppController.class);

  @PostMapping("/app/sendEvent")
  OutputResult<Object> sendEvent(@RequestParam String filePath) throws Exception {
    improperPusher.transferAndSendEvent(filePath);
    return new OutputResult<>(null);
  }

  @Data
  @AllArgsConstructor
  public static class EventInfo {
    Integer deviceId;
    List<String> filePath;
    String videoPath;
    String imagePath;
  }

  @PostMapping("/app/sendMyEvent")
  OutputResult<Object> sendMyEvent(@RequestBody EventInfo eventInfo) throws Exception {
    if (eventInfo.getVideoPath() != null || eventInfo.getImagePath() != null) {
      eventInfo.setFilePath(Arrays.asList(eventInfo.getImagePath(), eventInfo.getVideoPath()));
    }
    improperPusher.transferAndSendEvent(eventInfo.filePath, eventInfo.deviceId);
    return new OutputResult<>(null);
  }
}
