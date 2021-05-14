package xiong.monitor.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("monitor_model")
public class AIModel {
  public AIModel() {}

  public AIModel(
      Long id,
      String name,
      String description,
      Long sceneId,
      String modelPath
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.sceneId = sceneId;
    this.modelPath = modelPath;
    this.createTime = new Date();
    this.updateTime = new Date();
  }

  @TableId(type = IdType.AUTO)
  private Long id;

  private String name;

  private String description;

  private Long sceneId;

  private String modelPath;

  private Date createTime;
  private Date updateTime;
}
