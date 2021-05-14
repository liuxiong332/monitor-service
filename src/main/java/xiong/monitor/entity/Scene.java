package xiong.monitor.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.util.Date;

@Data
@TableName("monitor_scene")
public class Scene {
  public Scene() {}

  public Scene(
      Long id,
      String name,
      String description,
      Long modelId
  ) {
    this.sceneId = id;
    this.name = name;
    this.description = description;
    this.modelId = modelId;
    this.createTime = new Date();
    this.updateTime = new Date();
  }

  @TableId(type = IdType.AUTO)
  private Long sceneId;

  private String name;

  private String description;

  @TableField(updateStrategy=FieldStrategy.IGNORED)
  private Long modelId;

  private Date createTime;
  private Date updateTime;
}
