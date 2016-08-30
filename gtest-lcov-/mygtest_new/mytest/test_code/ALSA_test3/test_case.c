// Copyright 2005, Google Inc.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//     * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// A sample program demonstrating using Google C++ testing framework.
//
// Author: wan@google.com (Zhanyong Wan)


// This sample shows how to write a simple unit test for a function,
// using Google C++ testing framework.
//
// Writing a unit test using Google C++ testing framework is easy as 1-2-3:


// Step 1. Include necessary header files such that the stuff your
// test logic needs is declared.
//
// Don't forget gtest.h, which declares the testing framework.

#include <limits.h>
#include "gtest/gtest.h"
#include "HAL_Audio_Display.h"


// Step 2. Use the TEST macro to define your tests.
//
// TEST has two parameters: the test case name and the test name.
// After using the macro, you should define your test logic between a
// pair of braces.  You can use a bunch of macros to indicate the
// success or failure of a test.  EXPECT_TRUE and EXPECT_EQ are
// examples of such macros.  For a complete list, see gtest.h.
//
// <TechnicalDetails>
//
// In Google Test, tests are grouped into test cases.  This is how we
// keep test code organized.  You should put logically related tests
// into the same test case.
//
// The test case name and the test name should both be valid C++
// identifiers.  And you should not use underscore (_) in the names.
//
// Google Test guarantees that each test you define is run exactly
// once, but it makes no guarantee on the order the tests are
// executed.  Therefore, you should write your tests in such a way
// that their results don't depend on their order.
//
// </TechnicalDetails>


// Tests Factorial().

// Tests factorial of negative numbers.

static void fun(int msg, void* userdata)
{
	printf("msg is %d", msg);	
}

ni_Audio_Render_Config_t configinfo = {0, 44100, 2, NIAUDIO_STREAM_FORMAT_TYPE_S16LE, 0, fun};

unsigned char *data = (unsigned char*)malloc(50000000);


TEST(Audio_Waveout_OpenTest, isRight)
{
	EXPECT_EQ(0, Audio_Waveout_Open(configinfo));
}

TEST(Audio_Waveout_WriteiTest, isRun)
{
	FILE* f;
	f = fopen("/home/fanchenxin/mytest/test_code/ALSA_test3/aiweier.wav", "r");
	if(f == NULL)
	{
		printf("open file faild\n");
		exit(0);
	}

	//static unsigned char data[50000000];
	
	unsigned char *dat = data;
	int r = 0, count = 0;
	while(1)
	{
		if((r = fread(dat, 1, 1024, f)) == 0)
			break;
		count += r;
		dat += r;
	}

	dat = data;
	printf("play time = %d ms\n", calcPcmHandleTime(count));
	EXPECT_EQ(count, Audio_Waveout_Writei(dat, count));  //one period bytes is 3760
}


TEST(Audio_Waveout_CloseTest, isOk)
{
	printf("ring buffer total size = %d, one period size = %d\n", getPcmBufferTotalSize(), getPcmBufferOnePeriodSize());
	
	EXPECT_EQ(0, Audio_Waveout_Close());

	free(data);
	data = NULL;
}

// Step 3. Call RUN_ALL_TESTS() in main().
//
// We do this by linking in src/gtest_main.cc file, which consists of
// a main() function which calls RUN_ALL_TESTS() for us.
//
// This runs all the tests you've defined, prints the result, and
// returns 0 if successful, or 1 otherwise.
//
// Did you notice that we didn't register the tests?  The
// RUN_ALL_TESTS() macro magically knows about all the tests we
// defined.  Isn't this convenient?
