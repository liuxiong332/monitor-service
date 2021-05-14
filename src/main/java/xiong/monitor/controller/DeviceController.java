package xiong.monitor.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xiong.monitor.device.DeviceCmd;
import xiong.monitor.entity.Device;
import xiong.monitor.mapper.DeviceMapper;
import xiong.monitor.util.OutputResult;

import java.util.List;

@RestController
class DeviceController {

  @Autowired
  private DeviceMapper deviceMapper;

  @Autowired
  private DeviceCmd deviceCmd;

  private Logger logger = LoggerFactory.getLogger(DeviceController.class);

  @GetMapping("/devices/{id}")
  OutputResult<Device> getDevice(@PathVariable Long id) {
    Device device = deviceMapper.selectById(id);
    return new OutputResult<>(device);
  }

  @GetMapping("/devices")
  OutputResult<List<Device>> getDevices() {
    List<Device> devices = deviceMapper.selectList(new QueryWrapper<>());
    return new OutputResult<>(devices);
  }

  @PostMapping("/devices")
  OutputResult<Long> addDevice(@RequestBody Device device) {
    deviceMapper.insert(device);
    deviceCmd.updateDevices();
    return new OutputResult<>(device.getDeviceId());
  }

  @PutMapping("/devices/{id}")
  OutputResult<Object> updateDevice(@RequestBody Device device, @PathVariable Long id) {
    logger.info("Will update device " + device.toString());
    device.setDeviceId(id);
    deviceMapper.updateById(device);
    deviceCmd.updateDevices();
    return new OutputResult<>(null);
  }

  @DeleteMapping("/devices/{id}")
  OutputResult<Object> deleteDevice(@PathVariable Long id) {
    deviceMapper.deleteById(id);
    deviceCmd.updateDevices();
    return new OutputResult<>(null);
  }
}
