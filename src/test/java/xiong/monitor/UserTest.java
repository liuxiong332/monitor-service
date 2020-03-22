package xiong.monitor;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import xiong.monitor.entity.User;
import xiong.monitor.mapper.UserMapper;

import java.util.List;

@SpringBootTest
class UserTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    void testSelect() {
        userMapper.deleteById(1L);
        User myUser = new User(null, "l@x", "test@test", "pass");

        userMapper.insert(myUser);
        QueryWrapper<User> userQuery = new QueryWrapper<>();
        userQuery.eq("name", "l@x");
        List<User> userList = userMapper.selectList(userQuery);
        // Assertions.assertEquals(1, userList.size());

        userMapper.deleteById(myUser.getUserId());
        // userList.forEach(System.out::println);

         Assertions.assertEquals(userList.get(0).getName(), myUser.getName());
    }
}