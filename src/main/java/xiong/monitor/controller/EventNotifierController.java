package xiong.monitor.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import xiong.monitor.util.OutputResult;

@RestController
public class EventNotifierController {
    Logger logger = LoggerFactory.getLogger(EventNotifierController.class);

    @PostMapping("/sendFileEvent")
    OutputResult<Object> sendEvent(@RequestParam String path) {
        logger.info("Receive file event with path {}", path);
        return new OutputResult<>(null);
    }
}
