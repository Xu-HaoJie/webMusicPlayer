#include "HAL_Audio_Display.h"

/** global value define   ***/
static snd_pcm_uframes_t  period_size, buffer_size;  /**< peirod and buffer size in frames   */ 
static unsigned int bits_per_sample = 16, bits_per_frame = 32;  /**< bits per sample and frame */
static snd_pcm_format_t format;        /**< sample format  */
static snd_pcm_t *handle = NULL;     /**< pcm handle   */


/*
typedef struct _ni_Audio_Render_Config 							
{												
	int	rate; 						 // sampling rate 				
	int	channels;						 // stereo or mono					
	int	format;						 // data format S16_LE and so on ...					
	void (*callback)(AUDIO_MSG_ID_T msg);			// callback for notify msg 					
								
} ni_Audio_Render_Config_t;								
*/

/** @brief global call back function pointer define  */	
static void (*gCallBack)(AUDIO_MSG_ID_T msg);

/**
* @brief change the format to pcm format
* @param[in] format
* @reutrn pcm format
*/
snd_pcm_format_t getPcmFormat(int format)
{
	snd_pcm_format_t pcm_formate;
	switch(format)
	{
		case 16:
			pcm_formate =  SND_PCM_FORMAT_S16_LE;
			break;	
	}
	return pcm_formate;
}

/**
* @brief function: open pcm device and set the hardware and sorftware params
* @param[in] "configinfo" include some init information
* @return success return 0 otherwise return a negative error number
*/
int Audio_Waveout_Open(ni_Audio_Render_Config_t configinfo)
{
     int err;
     snd_pcm_hw_params_t *hwparams;
     snd_pcm_sw_params_t *swparams;
	const char* devicename = "default";

	/*open pcm device*/
	if ((err = snd_pcm_open(&handle, devicename, SND_PCM_STREAM_PLAYBACK, 0)) < 0) {
               fprintf(stderr, "Error in snd_pcm_open [ %s]\n", devicename);
                return err;
     }

	/* allocate an invalid snd_pcm_hw(sw)_params_t using standard alloca */
     snd_pcm_hw_params_alloca(&hwparams);   
     snd_pcm_sw_params_alloca(&swparams);   

     /******************* start hardware params setting **********************/
	unsigned int sample_rate;
	unsigned int buffer_time, period_time;
	
	/* Init hwparams with full configuration space */
	if ((err = snd_pcm_hw_params_any(handle, hwparams)) < 0) {
		fprintf(stderr, "Error in snd_pcm_hw_params_any\n");
		return err;
	}

	if ((err = snd_pcm_hw_params_set_access(handle, hwparams, SND_PCM_ACCESS_RW_INTERLEAVED)) < 0) {
		fprintf(stderr, "Error in snd_pcm_hw_params_set_access\n");
		return err;
	}

	/* Set sample format */
	format = getPcmFormat(configinfo.format);
	if(format == SND_PCM_FORMAT_UNKNOWN)
		format = DEFAULT_FORMAT;
	if ((err = snd_pcm_hw_params_set_format(handle, hwparams, format)) < 0) {
		fprintf(stderr, "Error in snd_pcm_hw_params_set_format\n");
		return err;
	}

	/* Set number of channels */
	if ((err = snd_pcm_hw_params_set_channels(handle, hwparams, DEFAULT_CHANNELS)) < 0) {
		fprintf(stderr, "Error in snd_pcm_hw_params_set_channels\n");
		return err;
	}
	
	/* Set sample rate. If the exact rate is not supported */
	/* by the hardware, use nearest possible rate.         */ 
	sample_rate = configinfo.rate;
	if(sample_rate < 2000 || sample_rate > 192000)
		sample_rate = 44100;
	if ((err = snd_pcm_hw_params_set_rate_near(handle, hwparams, &sample_rate, 0)) < 0) {
		fprintf(stderr, "Error in snd_pcm_hw_params_set_rate_near\n");
		return err;
	}
	
	if ((float)configinfo.rate * 1.05 < sample_rate || (float)configinfo.rate * 0.95 > sample_rate) {
		fprintf(stderr, "The rate %d Hz is not supported by your hardware, got the rate %d.\n", 
			configinfo.rate, sample_rate);
	}

	/*get the max buffer time of hardware device*/
	if ((err = snd_pcm_hw_params_get_buffer_time_max(hwparams, &buffer_time, 0)) < 0) {
		fprintf(stderr, "Error in snd_pcm_hw_params_get_buffer_time_max\n");
		return err;
	}
	if (buffer_time > 500000) 
		buffer_time = 500000;
	period_time = buffer_time / 4;
	/*set buffer time*/
	if ((err = snd_pcm_hw_params_set_buffer_time_near(handle, hwparams, &buffer_time, 0)) < 0) {
		fprintf(stderr, "Error in snd_pcm_hw_params_set_buffer_time_near\n");
		return err;
	}
	/*set period time*/
	if ((err = snd_pcm_hw_params_set_period_time_near(handle, hwparams, &period_time, 0)) < 0) {
		fprintf(stderr, "Error snd_pcm_hw_params_set_period_time_near\n");
		return err;
	}

	/* Set hw params */
	if ((err = snd_pcm_hw_params(handle, hwparams)) < 0) {
		fprintf(stderr, "Error in snd_pcm_hw_params(handle, params)\n");
		return err;
	}
	/********************end the hardware params setting***********************/

	/*get the period size and buffer size (in frames)*/
	snd_pcm_hw_params_get_period_size(hwparams, &period_size, 0);	
	snd_pcm_hw_params_get_buffer_size(hwparams, &buffer_size);
	if (period_size == buffer_size) {		
		fprintf(stderr, ("Can't use period equal to buffer size (%lu == %lu)\n"), period_size, buffer_size);		
		return -1;
	}

	bits_per_sample = snd_pcm_format_physical_width(format);
	bits_per_frame = bits_per_sample * DEFAULT_CHANNELS;
	
	printf("bytes_per_frame = %d, bytes_per_peirod = %d\n", bits_per_frame >> 3, period_size * (bits_per_frame >> 3));
	/*************start sortware params setting********************/
	 /* get the current swparams */
     if((err = snd_pcm_sw_params_current(handle, swparams)) < 0){
            fprintf(stderr, "Error in snd_pcm_sw_params_current()\n");
            return err;
     }
	
	/*Set start threshold inside a software configuration container*/
	/*PCM is automatically started when playback frames available to PCM 
	   are>= threshold or when requested capture frames are >= threshold */
	if((err = snd_pcm_sw_params_set_start_threshold(handle, swparams, period_size)) < 0){
		fprintf(stderr, " Error in snd_pcm_sw_params_set_start_threshold()\n");
		return err;
	}

	 /* write the parameters to the playback device */
        if((err = snd_pcm_sw_params(handle, swparams)) < 0){
                fprintf(stderr, "Error in snd_pcm_sw_params()\n");
                return err;
        }
     /********************end the sorftware params setting***********************/

	 /*
	 //start the pcm device
	 if ((err = snd_pcm_start(handle)) < 0) {
               fprintf(stderr, " Error in snd_pcm_start()\n");
               return err;
      }
	 */

	 /*register call back function*/
	 gCallBack = configinfo.callback;
	 
	return 0;   	  
}

/**
* @brief function: write count size (in byte) data to a pcm
* @param[in] "data" is the data waiting write to PCM, 
* @param[in] "count" is the number of write data in byte
* @return a positive number of bytes actually written otherwise a negative error code
*/
size_t Audio_Waveout_Writei(void* data, size_t count) 
{
	if(data == NULL || count <= 0)
		return -1;
	
	size_t ret = 0;
	snd_pcm_sframes_t r;
	snd_pcm_uframes_t count_frames = (count << 3) / bits_per_frame; /* number in byte change to number in frame */
	printf("count = %d, count_frames = %d\n", count, count_frames);
	
	/* if write counts not enough one period size, fill the rest with silence data */
	if (count_frames < period_size) {
		snd_pcm_format_set_silence(format, data + ((count_frames * bits_per_frame) >> 8), (period_size - count_frames) * DEFAULT_CHANNELS);
		count_frames = period_size;
	}

	printf("afterchange_count_frames = %d\n", count_frames);

	while(count_frames > 0)
	{
		/* Write interleaved frames to a PCM. */
		r = snd_pcm_writei(handle, data, count_frames);
		printf("wr = %d, count_frames = %d\n", r, count_frames);
		if(r == -EPIPE)  //x_run happen
		{
			/* Prepare PCM for use */
			if((r = snd_pcm_prepare(handle)) < 0){
				fprintf(stderr, "can't recover from under_run!\n");
				gCallBack(MSG_UNDER_RUN_ERR);
				return r;
			}
		}
		else if(r == -ESTRPIPE) /* stream is suspended and waiting for an application recovery */
		{
			/*Resume from suspend, no samples are lost.*/
			while((r = snd_pcm_resume(handle)) == -EAGAIN)
				sleep(1);
			 if (r < 0) {
                        if((r = snd_pcm_prepare(handle)) < 0)
                        {
						fprintf(stderr, "can't resume from suspend!\n");
				           gCallBack(MSG_SUSPEND_STATE_ERR);
				           return r;
                        }
                }
		}
		else if(r == -EBADFD){   /* PCM is not in the right state */
			fprintf(stderr, "pcm device in the wrong state!");
			gCallBack(MSG_WRONG_STATE_ERR);
		}

		if(r > 0)
		{
			int nbytes = (r * bits_per_frame) >> 3;
			data += nbytes;
			count_frames -= r;
			ret += nbytes;
			printf("r= %d, bitsperframe = %d, nbytes = %d, ret = %d\n",r, bits_per_frame, nbytes, ret);
		}
	}
	return ret;
}

/**
* @brief function: close the pcm device
* @return 0 success otherwise return a negative error code
*/
int Audio_Waveout_Close()
{
	int err;
	if(handle)
		err = snd_pcm_close(handle);
	return err;
}
