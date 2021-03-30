package xiong.monitor.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("monitor_device")
public class Device {
  public Device() {}

  public Device(
      Long id,
      String name,
      String password,
      String serviceUrl,
      Integer deviceType,
      String location,
      String deviceIp,
      String path,
      Integer status
  ) {
    this.deviceId = id;
    this.name = name;
    this.password = password;
    this.serviceUrl = serviceUrl;
    this.deviceType = deviceType;
    this.location = location;
    this.deviceIp = deviceIp;
    this.path = path;
    this.status = status;
    this.createTime = new Date();
    this.updateTime = new Date();
  }

  @TableId(type = IdType.AUTO)
  private Long deviceId;

  private String name;

  private String password;

  private String serviceUrl;
  private Integer deviceType;
  private String location;

  private String deviceIp;
  private String path;
  private Integer status;

  private Date createTime;
  private Date updateTime;
}
