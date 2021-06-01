package xiong.monitor.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("event_record")
public class EventRecord {
  public EventRecord() {}

  public EventRecord(String eventId, Date eventDate, String fileNames, Integer deviceId, Integer sceneId, String info) {
    this.eventId = eventId;
    this.eventDate = eventDate;
    this.fileNames = fileNames;
    this.deviceId = deviceId;
    this.sceneId = sceneId;
    this.info = info;
  }

  @TableId(type = IdType.INPUT)
  private String eventId;

  private Date eventDate;
  private String fileNames;

  private Integer deviceId;
  private Integer sceneId;
  private String info;
}
