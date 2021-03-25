package xiong.monitor.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("monitor_scene")
public class Scene {
  public Scene() {}

  public Scene(
      Long id,
      String name,
      String description
  ) {
    this.sceneId = id;
    this.name = name;
    this.description = description;
    this.createTime = new Date();
    this.updateTime = new Date();
  }

  @TableId(type = IdType.AUTO)
  private Long sceneId;

  private String name;

  private String description;

  private Date createTime;
  private Date updateTime;
}
