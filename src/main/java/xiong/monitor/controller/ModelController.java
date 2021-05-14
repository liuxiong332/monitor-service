package xiong.monitor.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import xiong.monitor.entity.AIModel;
import xiong.monitor.entity.Scene;
import xiong.monitor.mapper.ModelMapper;
import xiong.monitor.mapper.SceneMapper;
import xiong.monitor.util.OutputResult;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
class ModelController {

  @Autowired
  private ModelMapper modelMapper;

  @Autowired
  private SceneMapper sceneMapper;

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

    QueryWrapper<Scene> queryWrapper = new QueryWrapper<Scene>();
    queryWrapper.eq("model_id", id);
    List<Scene> scenes = sceneMapper.selectList(queryWrapper);
    scenes.forEach(scene -> {
      scene.setModelId(null);
      sceneMapper.updateById(scene);
    });
    return new OutputResult<>(null);
  }

  @PostMapping("/models/upload")
  OutputResult<Object> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("uploadPath") String uploadPath) throws IOException {
    String userHomeDir = System.getProperty("user.home");

    Path modelDir = Paths.get(userHomeDir, "models");
    modelDir.toFile().mkdir();

    Path uploadDir = Paths.get(modelDir.toString(), uploadPath);
    uploadDir.toFile().mkdir();

    Path filePath = Paths.get(uploadDir.toString(), file.getOriginalFilename());
    logger.info("Will save file to {}", filePath);
    Files.copy(file.getInputStream(), filePath);
    return new OutputResult<>(null);
  }
}
