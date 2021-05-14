package xiong.monitor.util;

import java.nio.file.Path;
import java.nio.file.Paths;

public class ModelPaths {

    public static Path getModelsUploadDir() {
        String userHomeDir = System.getProperty("user.home");
        return Paths.get(userHomeDir, "models");
    }

    public static String getModelDir(String modelName) {
        return Paths.get(getModelsUploadDir().toString(), modelName).toString();
    }
}
