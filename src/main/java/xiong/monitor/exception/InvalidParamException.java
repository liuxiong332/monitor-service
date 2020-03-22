package xiong.monitor.exception;

public class InvalidParamException extends RuntimeException {
    public InvalidParamException(String msg) {
        super(msg);
    }

    public InvalidParamException() {
        super();
    }
}
