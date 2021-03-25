package xiong.monitor.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xiong.monitor.entity.AIModel;
import xiong.monitor.entity.Scene;
import xiong.monitor.mapper.ModelMapper;
import xiong.monitor.util.OutputResult;

import java.util.List;

@RestController
class ModelController {

  @Autowired
  private ModelMapper modelMapper;

  private Logger logger = LoggerFactory.getLogger(ModelController.class);

  @GetMapping("/models/{id}")
  OutputResult<AIModel> getModel(@PathVariable Long id) {
    AIModel device = modelMapper.selectById(id);
    return new OutputResult<>(device);
  }

  @GetMapping("/models")
  OutputResult<List<AIModel>> getModels() {
    List<AIModel> devices = modelMapper.selectList(new QueryWrapper<>());
    return new OutputResult<>(devices);
  }

  @PostMapping("/models")
  OutputResult<Long> addModel(@RequestBody AIModel device) {
    modelMapper.insert(device);
    return new OutputResult<>(device.getId());
  }

  @PutMapping("/models/{id}")
  OutputResult<Object> updateModel(@RequestBody AIModel device, @PathVariable Long id) {
    logger.info("Will update device " + device.toString());
    device.setId(id);
    modelMapper.updateById(device);
    return new OutputResult<>(null);
  }

  @DeleteMapping("/models/{id}")
  OutputResult<Object> deleteModel(@PathVariable Long id) {
    modelMapper.deleteById(id);
    return new OutputResult<>(null);
  }
}
