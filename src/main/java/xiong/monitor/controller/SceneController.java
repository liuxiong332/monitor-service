package xiong.monitor.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xiong.monitor.device.DeviceCmd;
import xiong.monitor.entity.Device;
import xiong.monitor.entity.Scene;
import xiong.monitor.mapper.DeviceMapper;
import xiong.monitor.mapper.SceneMapper;
import xiong.monitor.util.OutputResult;

import java.util.List;

@RestController
class SceneController {

  @Autowired
  private SceneMapper sceneMapper;

  private Logger logger = LoggerFactory.getLogger(SceneController.class);

  @GetMapping("/scenes/{id}")
  OutputResult<Scene> getScene(@PathVariable Long id) {
    Scene device = sceneMapper.selectById(id);
    return new OutputResult<>(device);
  }

  @GetMapping("/scenes")
  OutputResult<List<Scene>> getScenes() {
    List<Scene> devices = sceneMapper.selectList(new QueryWrapper<>());
    return new OutputResult<>(devices);
  }

  @PostMapping("/scenes")
  OutputResult<Long> addScene(@RequestBody Scene device) {
    sceneMapper.insert(device);
    return new OutputResult<>(device.getSceneId());
  }

  @PutMapping("/scenes/{id}")
  OutputResult<Object> updateScene(@RequestBody Scene device, @PathVariable Long id) {
    logger.info("Will update device " + device.toString());
    device.setSceneId(id);
    sceneMapper.updateById(device);
    return new OutputResult<>(null);
  }

  @DeleteMapping("/scenes/{id}")
  OutputResult<Object> deleteScene(@PathVariable Long id) {
    sceneMapper.deleteById(id);
    return new OutputResult<>(null);
  }
}
