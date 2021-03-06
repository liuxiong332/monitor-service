package xiong.monitor.device;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import xiong.monitor.entity.Device;
import xiong.monitor.mapper.DeviceMapper;

import java.util.List;

@Component
@Profile("!test")
public class DeviceStarter implements ApplicationRunner {

    @Autowired
    private DeviceCmd deviceCmd;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try {
            deviceCmd.updateDevices();
        } catch (Exception e) {
            e.printStackTrace(System.err);
        }
    }
}
