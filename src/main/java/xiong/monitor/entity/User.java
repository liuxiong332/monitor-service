package xiong.monitor.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("monitor_user")
public class User {
  public User() {}

  public User(Long id, String name, String email, String password) {
    this.userId = id;
    this.name = name;
    this.password = password;
    this.email = email;
    this.createTime = new Date();
    this.updateTime = new Date();
  }

  @TableId(type = IdType.AUTO)
  private Long userId;

  private String name;
  private String email;
  private String password;

  private Date createTime;
  private Date updateTime;
}
