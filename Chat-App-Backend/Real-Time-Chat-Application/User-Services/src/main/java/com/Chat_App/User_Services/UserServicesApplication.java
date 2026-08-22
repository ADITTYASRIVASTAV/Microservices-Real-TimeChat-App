package com.Chat_App.User_Services;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableDiscoveryClient
@EnableKafka
public class UserServicesApplication
{

	public static void main(String[] args)
	{
		SpringApplication.run(UserServicesApplication.class, args);
	}

}
