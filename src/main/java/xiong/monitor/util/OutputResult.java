package xiong.monitor.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OutputResult<T> {
    private T data;
    private Integer code;
    private String errMsg;

    public OutputResult(T data) {
        this.data = data;
        this.code = 200;
        this.errMsg = null;
    }

    public OutputResult(Integer code, String errMsg) {
        this.data = null;
        this.code = code;
        this.errMsg = errMsg;
    }
}
