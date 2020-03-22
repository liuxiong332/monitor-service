package xiong.monitor.config;

import org.apache.coyote.http11.AbstractHttp11Protocol;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.stereotype.Component;

@Component
public class TomcatConfig implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

    @Override
    public void customize(TomcatServletWebServerFactory factory) {
        factory.addConnectorCustomizers(connector -> {
            AbstractHttp11Protocol protocol = (AbstractHttp11Protocol)connector.getProtocolHandler();
            protocol.setMaxKeepAliveRequests(100); // 设置keep alive最大数目
            protocol.setKeepAliveTimeout(1800000); // 设置keep alive的超时时间
        });
    }
}
