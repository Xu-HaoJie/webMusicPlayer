#include <stdarg.h>					
#include <stdio.h>
#include <sys/time.h>
#include <time.h>

#include "log_out.h"

void Log_out(char* log_format, ...)
	{
		struct timespec ts;
		clock_gettime(CLOCK_MONOTONIC, &ts);

		char chLog[1024];
		va_list	w_arg;
		va_start( w_arg, log_format );
		snprintf( chLog, 30, "[%4u:%09u]           ",  ts.tv_sec, ts.tv_nsec);		
		vsnprintf( chLog+20, 1024 - 21, log_format, w_arg);
		va_end( w_arg );
		printf( "%s", chLog);
	}
