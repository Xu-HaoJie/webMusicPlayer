/**
 * Copyright @ 2013 - 2015 Suntec Software(Shanghai) Co., Ltd.
 * All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are NOT permitted except as agreed by
 * Suntec Software(Shanghai) Co., Ltd.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 */
/**
 * @file one_seg_audio_render.h
 *
 * provide audio render IF
 *
 * @attention used for C only.
 */
#ifndef NI_MEDIAHAL_AUDIORENDER_H
#define NI_MEDIAHAL_AUDIORENDER_H

#if defined(__cplusplus)
extern "C"
{
#endif

#define bool int

typedef enum _NI_AUDIO_ERR_TYPE
{
	NIAUDIO_NOERROR = 0,                            ///< no error
	NIAUDIO_ERROR_INVALID_PARAMETER = -1,           ///< error of invalid parameters
	NIAUDIO_ERROR_NO_CREATE = -2,                   ///< operate a not created stream
	NIAUDIO_ERROR_PULSEAUDIO = -3,                  ///< error when call pulseaudio api
	NIAUDIO_ERROR_CONTEXTNOTREADY  = -4,            ///< error when context is not ready
	NIAUDIO_ERROR_TOKEN_NOT_VALID = -5              ///< error when your token is valid now
} NI_AUDIO_ERR_TYPE_DEF_T;

typedef enum _NI_AUDIO_STREAM_FORMAT_TYPE
{
	NIAUDIO_STREAM_FORMAT_TYPE_U8,
	NIAUDIO_STREAM_FORMAT_TYPE_ALAW,
	NIAUDIO_STREAM_FORMAT_TYPE_ULAW,
	NIAUDIO_STREAM_FORMAT_TYPE_S16LE,
	NIAUDIO_STREAM_FORMAT_TYPE_S16BE,
	NIAUDIO_STREAM_FORMAT_TYPE_FLOAT32LE,
	NIAUDIO_STREAM_FORMAT_TYPE_FLOAT32BE,
	NIAUDIO_STREAM_FORMAT_TYPE_S32LE,
	NIAUDIO_STREAM_FORMAT_TYPE_S32BE,
	NIAUDIO_STREAM_FORMAT_TYPE_S24LE,
	NIAUDIO_STREAM_FORMAT_TYPE_S24BE,
	NIAUDIO_STREAM_FORMAT_TYPE_S24_32LE,
	NIAUDIO_STREAM_FORMAT_TYPE_S24_32BE,
	NIAUDIO_STREAM_FORMAT_TYPE_MAX,
	NIAUDIO_STREAM_FORMAT_TYPE_AUTO,
	NIAUDIO_STREAM_FORMAT_TYPE_INVALID = -1
} NI_AUDIO_STREAM_FORMAT_TYPE_DEF_T;

typedef enum _NI_ONE_SEG_AUDIO_DEVICE_TYPE
{
	NIONE_SEG_AUDIO_DEVICE_OUTPUT_FRONT = 0,        ///< Device Type for output front
	NIONE_SEG_AUDIO_DEVICE_OUTPUT_REAR,             ///< Device Type for output rear
	NIONE_SEG_AUDIO_DEVICE_OUTPUT_MIRROR            ///< Device Type for output front + rear mirror
} NI_ONE_SEG_AUDIO_DEVICE_TYPE_DEF_T;


typedef enum _NI_ONE_SEG_AUDIO_MSG_ID
{
	NIONE_SEG_MSG_QUIT = 0,                         ///< audioserver thread quit msg
	NIONE_SEG_MSG_SERVER_DIED = -1,                 ///< audioserver died notify
	NIONE_SEG_MSG_TOKEN_ID_INVALID = -2,            ///< audioserver token id invalid
	NIONE_SEG_MSG_A2DP_CODEC_ERR = -3,              ///< bt audio error notify message
	NIONE_SEG_MSG_UNDER_RUN_ERR = -4                ///< playback underrun notify
} NI_ONE_SEG_AUDIO_MSG_ID_T;

typedef enum _NI_ONE_SEG_AUDIO_FADE_MODE
{
	NI_ONE_SEG_AUDIO_FADE_OUT = 0,                                
	NI_ONE_SEG_AUDIO_FADE_IN
} NI_ONE_SEG_AUDIO_FADE_MODE_T;

typedef void (*ni_Audio_on_msg_func_t)(int msg, void* userdata);

typedef struct _ni_Audio_Render_Config
{
	int device;                     // front speaker or rear or mirror 
	int rate;                       // sampling rate
	int channels;                   // stereo or mono
	int format;                     // data format S16_LE and so on ...
	int latency;                    // latency time in ms (needs tunning!!)
	ni_Audio_on_msg_func_t callback;        // callback for notify msg
	void* userdata;                 // callback userdata when notify

	// if latency=250ms, latency_hw=50ms, then pulse-latency=250-50=200ms
	int latency_hw;                 // ALSA latency time in ms (needs tunning!!)

} ni_Audio_Render_Config_t;

typedef struct _ni_Oneseg_Audio_Render_Api
{
	/// create audio render
	int (*create_audio_render)(const ni_Audio_Render_Config_t* cfg);

	/// destroy audio render
	int (*destroy_audio_render)();

	/// write audio data
	int (*write_audio_render)(const void* buf, unsigned int buf_size);

	/// get audio whole latency (including alsa buffer)
	long long (*get_latency)(void);

	/// not used any  more
	long long (*get_audio_render_consumed_size)();

	/// set pwm level [0~100]
	void (*set_pwm)(int pwm_level);
	    
	/// not used any more
	void (*update_output_device)(int device_type);

	/// flush (within a mute effect to avoid pop noise)
	void (*flush)(void);

	/// set fade 
	void (*set_fade)(int fade_mode, int fade_time_ms);

	/// get audio latency (add alsa buffer if necessary)
	long long (*get_latencyEx)(bool isAlsaBuffer_added);

} ni_Oneseg_Audio_Render_Api_t;


// examples
/*

void on_msg_from_audio_server(int msg_id, void* userdata)
{
    if (msg_id == NIONE_SEG_MSG_UNDER_RUN_ERR) {
        printf("under-run!!!\n");
    }
}

oneseg_audio_render_api api;
audio_render_config cfg = {
       ONE_SEG_AUDIO_DEVICE_OUTPUT_FRONT,   // output to front
       48000,                               // pcm sample rate = 48000
       2,                                   // pcm channel num = 2
       AUDIO_STREAM_FORMAT_TYPE_S16LE,      // pcm data format is signed litte endian 16 bit
       on_msg_from_audio_server,            // audio server message callback function
       NULL,                                // audio server message callback user data
       };
int32_t err = api.create_audio_render(cfg);
if(err == AUDIO_NOERROR)
{
    char data[1024*10] = {0};
    for(int i=0; i<10; ++i)
    {
        err = api.write_audio_render(data + i*1024, 1024);
        int64_t latency = api.get_latency();
        //....
        int pwm_level = 50;
        api.set_pwm(pwm_level);
    }
    api.destroy_audio_render();
}

*/
#if defined(__cplusplus)
}
#endif

#endif	/* NI_MEDIAHAL_AUDIORENDER_H */
