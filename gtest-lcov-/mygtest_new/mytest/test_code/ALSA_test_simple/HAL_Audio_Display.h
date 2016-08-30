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

#ifndef GTEST_SAMPLES_SAMPLE1_H_
#define GTEST_SAMPLES_SAMPLE1_H_

#include <stdio.h>
#include <malloc.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <errno.h>
#include <time.h>
#include <sys/unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <alsa/asoundlib.h>
#include <assert.h>

/**@def default sample format */
#define DEFAULT_FORMAT		(SND_PCM_FORMAT_S16)
/**@def default channels */
#define DEFAULT_CHANNELS   (2)

/**@brief error message enum*/
typedef enum _AUDIO_MSG_ID 	
{		
	 MSG_OVER_RUN_ERR ,	/**< over run error */	
	 MSG_UNDER_RUN_ERR,   /**< under run error */
	 MSG_WRONG_STATE_ERR,  /**< wrong state error */
	 MSG_SUSPEND_STATE_ERR  /**< suspend state error */
} AUDIO_MSG_ID_T; 	

typedef struct _ni_Audio_Render_Config 							
{												
	int	rate; 						 // sampling rate 				
	int	channels;						 // stereo or mono					
	int	format;						 // data format S16_LE and so on ...					
	void (*callback)(AUDIO_MSG_ID_T msg);			// callback for notify msg 					
								
} ni_Audio_Render_Config_t;								



/****************************************************************/
snd_pcm_format_t getPcmFormat(int format);

int Audio_Waveout_Open(ni_Audio_Render_Config_t configinfo);

size_t Audio_Waveout_Writei(void* data, size_t count) ;

int Audio_Waveout_Close();



#endif  // GTEST_SAMPLES_SAMPLE1_H_
