package xiong.monitor.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import xiong.monitor.util.OutputResult;

@RestController
public class EventNotifierController {
    Logger logger = LoggerFactory.getLogger(EventNotifierController.class);

    @PostMapping("/sendFileEvent")
    OutputResult<Object> sendEvent(@RequestBody String paths) {
        logger.info("Receive file event with path {}", paths);
        return new OutputResult<>(null);
    }
}
