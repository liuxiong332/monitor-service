package xiong.monitor.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xiong.monitor.device.DeviceCmd;
import xiong.monitor.entity.Device;
import xiong.monitor.entity.EventRecord;
import xiong.monitor.mapper.DeviceMapper;
import xiong.monitor.mapper.EventRecordMapper;
import xiong.monitor.util.OutputResult;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.List;
import java.util.TimeZone;

@RestController
class EventRecordController {

  @Autowired
  private EventRecordMapper eventRecordMapper;

  @Autowired
  private DeviceCmd deviceCmd;

  private Logger logger = LoggerFactory.getLogger(EventRecordController.class);

  @GetMapping("/events")
  OutputResult<List<EventRecord>> getEvents(
      @RequestParam(required = false) String scenes,
      @RequestParam(required = false) String startDate,
      @RequestParam(required = false) String endDate
  ) throws ParseException {
    QueryWrapper<EventRecord> queryWrapper = new QueryWrapper<EventRecord>();
    if (scenes != null) {
      queryWrapper.in("scene_id", (Object[]) scenes.split(","));
    }
    if (startDate != null && endDate != null) {
      SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
      dateFormat.setTimeZone(TimeZone.getTimeZone(ZoneId.of("Asia/Shanghai")));
      queryWrapper.lt("event_date", dateFormat.parse(endDate).getTime());
      queryWrapper.gt("event_date", dateFormat.parse(startDate).getTime());
    }
    List<EventRecord> records = eventRecordMapper.selectList(queryWrapper);
    return new OutputResult<>(records);
  }
}
