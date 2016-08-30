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
#include "ni_mediahal_AudioRender.h"
#include "return_flag.h"


/**@def default sample format */
#define DEFAULT_FORMAT		(SND_PCM_FORMAT_S16)
/**@def default channels */
#define DEFAULT_CHANNELS   (2)

/**@brief error message enum*/
typedef enum _AUDIO_MSG_ID 	
{	 
	MSG_NO_ERROR = 0,     /**< no error */
	MSG_INVALID_PARAMETER_ERR = -1,  /**< parameter is invalid */
	MSG_PCM_CREATE_ERROR,   /**< pcm is not open */
	 MSG_OVER_RUN_ERR ,	/**< over run error */	
	 MSG_UNDER_RUN_ERR,   /**< under run error */
	 MSG_WRONG_STATE_ERR,  /**< wrong state error */
	 MSG_SUSPEND_STATE_ERR  /**< suspend state error */
} AUDIO_MSG_ID_T; 	


/****************************************************************/
int getPcmBufferTotalSize();

int getPcmBufferOnePeriodSize();

int getPcmLatencySize();

int getPcmAvailSize();

unsigned int calcPcmHandleTime(unsigned int count);


static snd_pcm_format_t getPcmFormat(int format);

int Audio_Waveout_Open(ni_Audio_Render_Config_t configinfo);

int Audio_Waveout_Writei(void* data, unsigned int count) ;

int Audio_Waveout_Close();


