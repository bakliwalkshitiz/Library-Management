package com.kshitiz.librarymanagementsystem.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger =
            LoggerFactory.getLogger(LoggingAspect.class);

    @Before("execution(* com.kshitiz.librarymanagementsystem.service.*.*(..))")
    public void logMethodCall(JoinPoint joinPoint) {

        logger.info("Entering Method : {}", joinPoint.getSignature().toShortString());

        logger.info("Arguments : {}", Arrays.toString(joinPoint.getArgs()));
    }

    @AfterReturning(
            pointcut = "execution(* com.kshitiz.librarymanagementsystem.service.*.*(..))",
            returning = "result"
    )
    public void logMethodExit(JoinPoint joinPoint, Object result) {

        logger.info("Completed Method : {}", joinPoint.getSignature().toShortString());

        logger.info("Returned : {}", result);
    }
}