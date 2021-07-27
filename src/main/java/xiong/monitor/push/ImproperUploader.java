package xiong.monitor.push;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;

public interface ImproperUploader {
    String uploadFile(Date date, InputStream ins, String extension, String alartType) throws IOException;

    void uploadAlart(Date date, String alartType, String eventId, List<String> fileNames);
}
