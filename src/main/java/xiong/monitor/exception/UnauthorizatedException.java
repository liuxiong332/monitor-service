package xiong.monitor.exception;

public class UnauthorizatedException extends RuntimeException {
    public UnauthorizatedException(String msg) {
        super(msg);
    }

    public UnauthorizatedException() {
        super();
    }
}
