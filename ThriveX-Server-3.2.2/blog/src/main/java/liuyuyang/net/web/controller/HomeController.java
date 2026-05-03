package liuyuyang.net.web.controller;

import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Api(tags = "首页")
@Slf4j
@RestController
@RequestMapping("/")
public class HomeController {
    @GetMapping
    public String Home() {
        return "<h1>Hello ThriveX</h1>";
    }
}
