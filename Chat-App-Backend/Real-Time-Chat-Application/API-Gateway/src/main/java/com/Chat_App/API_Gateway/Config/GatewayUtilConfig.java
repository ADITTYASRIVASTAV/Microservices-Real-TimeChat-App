package com.Chat_App.API_Gateway.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;

@Configuration
public class GatewayUtilConfig {

    @Bean
    public PathMatcher pathMatcher() {
        return new AntPathMatcher();
    }
}
