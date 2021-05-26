package xiong.monitor.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("event_counter")
public class EventCounter {
  public EventCounter() {}

  public EventCounter(Long id, String eventDay, Integer counter) {
    this.id = id;
    this.eventDay = eventDay;
    this.counter = counter;
    this.createTime = new Date();
    this.updateTime = new Date();
  }

  @TableId(type = IdType.AUTO)
  private Long id;

  private String eventDay;
  private Integer counter;

  private Date createTime;
  private Date updateTime;
}
