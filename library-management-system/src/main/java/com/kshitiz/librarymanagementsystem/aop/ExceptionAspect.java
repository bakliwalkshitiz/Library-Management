package com.kshitiz.librarymanagementsystem.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ExceptionAspect {

    private static final Logger logger =
            LoggerFactory.getLogger(ExceptionAspect.class);

    @AfterThrowing(
            pointcut = "execution(* com.kshitiz.librarymanagementsystem.service.*.*(..))",
            throwing = "exception"
    )
    public void logException(JoinPoint joinPoint, Exception exception) {

        logger.error("Exception in {}",
                joinPoint.getSignature().toShortString());

        logger.error("Message : {}", exception.getMessage(), exception);
    }
}