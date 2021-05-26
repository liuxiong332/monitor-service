package xiong.monitor.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xiong.monitor.device.DeviceCmd;
import xiong.monitor.entity.Device;
import xiong.monitor.mapper.DeviceMapper;
import xiong.monitor.push.ImproperPusher;
import xiong.monitor.util.OutputResult;

import java.util.List;

@RestController
class AppController {

  @Autowired
  private ImproperPusher improperPusher;

  private Logger logger = LoggerFactory.getLogger(AppController.class);

  @PostMapping("/app/sendEvent")
  OutputResult<Device> getDevice(@RequestParam String filePath) throws Exception {
    improperPusher.transferAndSendEvent(filePath);
    return new OutputResult<>(null);
  }
}
