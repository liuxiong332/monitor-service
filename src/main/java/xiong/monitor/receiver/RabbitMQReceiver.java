package xiong.monitor.receiver;

import org.springframework.stereotype.Component;

@Component
public class RabbitMQReceiver {

    public void receiveMessage(String message) {
        System.out.println("Received <" + message + ">");
    }
}