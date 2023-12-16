from transformers import AutoModelForCausalLM, AutoTokenizer
import time
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    HfArgumentParser,
    TrainingArguments,
    logging,
)
import pandas as pd
import numpy as np
import time
from threading import Thread
from typing import Iterator


class Benchmarking:
    def __init__(self,INTEL=True):
        self.model_name = "mistralai/Mistral-7B-Instruct-v0.2"
        self.model = None
        self.tokenizer = None
        self.MAX_MAX_NEW_TOKENS = 2048
        self.DEFAULT_MAX_NEW_TOKENS = 2048
        self.MAX_INPUT_TOKEN_LENGTH = int(os.getenv("MAX_INPUT_TOKEN_LENGTH", "4096"))
        self.prompts = ["इतर माहिती: मौजा नागपूर येथील सिटी नं.101 व 159 शिट नं.227,233 मधील प्लॉट नं.05 यामध्ये टाकलेल्या 320 टेनामेंट अंतर्गत एच आय जी म्हाडा सिटी नागपूर स्किम मधील बिल्डींग नं.1 दहाव्या मजल्यावरील फ्लॅट नं.1/डी/1010 याची आराजी 89.304 चौरस मिटर आहे  Extract the values of keys in this JSON format from the above given texts.\n       If you do not find a match, leave the value empty. Translate all numbers in English.\n        Do NOT send the wrong answer.Extract multiple occurrences of the keys, separated by commas.\n        Extract only the following keys in JSON format: { \'वार्ड नं.\':"", \'घर नं.\':"", \'प्लॉट नं.\':"",\'शिट नं.\':"", \'सिटी सर्व्हे नं.\':"",\'खसरा नंबर\':"", \'प्लॉट ची आराजी\':"",\"क्षेत्रफळ\":"" ,\"Building Name\":""}" ,
           "इतर माहिती: मौजा- नागपूर,येथिल खसरा नं. 319/1-2-3-4,मधील प्लॉट नं. 198 ते309,ज्याचे एकुण क्षेञफळ 17436.001 चौ. मी. या वरील व्यंकटेश नगर मधील बिल्डींग नं. ए-13 मधील अपार्टमेंट नं. 03 तळ मजला याचे बांधीव क्षेञ 51.09 चौ.मी. याचा अविभक्त हिस्सा 0.209 टक्के आहे. याचा शिट नं. 248,व सिटी सर्वे नं. 101 हा आहे.  Extract the values of keys in this JSON format from the above given texts.\n        If you do not find a match, leave the value empty. Translate all numbers in English.\n        Do NOT send the wrong answer.Extract multiple occurrences of the keys, separated by commas.\n        Extract only the following keys in JSON format: { \'वार्ड नं.\':"", \'घर नं.\':"", \'प्लॉट नं.\':"",\'शिट नं.\':"", \'सिटी सर्व्हे नं.\':"",\'खसरा नंबर\':"", \'प्लॉट ची आराजी\':"",\"क्षेत्रफळ\":"" ,\"Building Name\":""}",
           "इतर माहिती: मौजा नागपूर,सिटी सर्व्हे नं. 101,शिट नं. 311,वार्ड नं. 13,गजानन चौक,रेशीमबाग,नागपूर येथील खसरा नं. 559 असून यात नागपूर सुधार प्रन्यासच्या इंडस्ट्रियल बस्ती स्किम अंतर्गत पाडलेल्या लेआऊट मधील प्लॉट नंबर 263,प्लॉटचे एकूण क्षेत्रफळ 410.535 चौरस मीटर लिज डिड नुसार व सिटी सर्व्हे रेकॉर्ड नुसार 410.50 चौरस मीटर तसेच यावर पक्के स्लॅबचे दोन मजली बांधकाम केलेले घर असून यात इलेक्ट्रिक मीटर,नळ,संडास-बाथरूम सह या वरील मालमत्ते मधील आम्ही आमचा लिहून देणारचा अविभक्त हिस्सा बाबत हक्क सोडून दिलेला आहे.  Extract the values of keys in this JSON format from the above given texts.\n        If you do not find a match, leave the value empty. Translate all numbers in English.\n        Do NOT send the wrong answer.Extract multiple occurrences of the keys, separated by commas.\n        Extract only the following keys in JSON format: { \'वार्ड नं.\':"", \'घर नं.\':"", \'प्लॉट नं.\':"",\'शिट नं.\':"", \'सिटी सर्व्हे नं.\':"",\'खसरा नंबर\':"", \'प्लॉट ची आराजी\':"",\"क्षेत्रफळ\":"" ,\"Building Name\":""}",
           "इतर माहिती: , इतर माहिती: मौजा नागपूर,तहसिल व जिल्हा नागपूर येथील खसरा क्र. 509 मधील नागपूर सुधार प्रन्यासचे लिजहोल्ड अमलगमेटेड भुखंड क्र. 121 आणि लगतची गल्ली याचे एकुण क्षेत्रफळ 293.791 चौ.मीटर यावर सुरेश अपार्टमेंट या नावाने बांधलेल्या ईमारती मधील पहिल्या माळयावरील सदनिका क्र. 101 याचा कार्पेट एरीया 37.709 चौ.मीटर,सुपर बिल्ट-अप एरीया 85.205 चौ.मीटर(इन्क्लुडींग पार्कींग एरीया 19.593 चौ.मीटर)असुन अमलगमेटेड भुखंड क्र. 121 आणि लगतची गल्ली मध्ये 10.590 टक्के अविभक्त हिस्सा आहे. याचा नगर भुमापन क्र. 192 आणि 261 आणि शिट क्र. 316 आहे.(विभाग क्र. 1.85/316 पान क्र. 197,दर रु. 46,000/- प्रति चौरस मीटर)  Extract the values of keys in this JSON format from the above given texts.\n        If you do not find a match, leave the value empty. Translate all numbers in English.\n        Do NOT send the wrong answer.Extract multiple occurrences of the keys, separated by commas.\n        Extract only the following keys in JSON format: { \'वार्ड नं.\':"", \'घर नं.\':"", \'प्लॉट नं.\':"",\'शिट नं.\':"", \'सिटी सर्व्हे नं.\':"",\'खसरा नंबर\':"", \'प्लॉट ची आराजी\':"",\"क्षेत्रफळ\":"" ,\"Building Name\":""}",
           "इतर माहिती: , इतर माहिती: मौजा-नागपूर,के. डी. के. कॉलेज नंदनवन नागपूर तहसिल जिल्हा नागपूर येथील खसरा क्रं. 319/1,2,3,4 या मधील प्लॉट नं. 1 ए,1 ते 5 याचे एकुण क्षेञफळ 2793.245 चौ.मी हा आहे. व तसेच या जागेवर बांधण्यात आलेल्या व्यंकटेश नगर या इमारती मधील पहिल्या माळयावरील बिल्डींग नंबर ई-2 मधील फ्लॅट/अपार्टमेंट 12 याचे एकुण क्षेञफळ 550 चौ.फुट (51.095 चौ.मी.) हा असुन जमिनी मध्ये 0.91 टक्के अविभक्त हिस्सा असुन याचा शिट नं. 248 व सिटी सर्व्हे नं. 101 व कॉर्पोरेशन घर क्रं. 1128/एफ/ई/2/12 हा आहे. ज्याचा मुद्दा क्रं. 1.57/248 व दर रुपये 43,600/-प्रति चौ.मी प्रमाणे आहे.  Extract the values of keys in this JSON format from the above given texts.\n        If you do not find a match, leave the value empty. Translate all numbers in English.\n        Do NOT send the wrong answer.Extract multiple occurrences of the keys, separated by commas.\n        Extract only the following keys in JSON format: { \'वार्ड नं.\':"", \'घर नं.\':"", \'प्लॉट नं.\':"",\'शिट नं.\':"", \'सिटी सर्व्हे नं.\':"",\'खसरा नंबर\':"", \'प्लॉट ची आराजी\':"",\"क्षेत्रफळ\":"" ,\"Building Name\":""}",
           "इतर माहिती: मौजा नागपूर प. नं. 292,विभाग नं. 1.38अ,बाजार भाव 84500 नं.भू.नं.101(पार्ट),शीट नं. 259,260,269,270,271 मध्ये 1,17,257 चौ.मी. जागेवर गोदरेज आनंदम वर्ल्ड सिटी टावर बी मधील 15 वा मजला,फॅमीली युनिट 1506,चटई क्षेत्र 100.520 चौ.मी. व सह गच्ची 10.870 चौ.मी.7 वर्षे जुने बांधकाम असल्यामुळे 10 टक्के घसारा घेतला आहे.  Extract the values of keys in this JSON format from the above given texts.\n        If you do not find a match, leave the value empty. Translate all numbers in English.\n        Do NOT send the wrong answer.Extract multiple occurrences of the keys, separated by commas.\n        Extract only the following keys in JSON format: { \'वार्ड नं.\':"", \'घर नं.\':"", \'प्लॉट नं.\':"",\'शिट नं.\':"", \'सिटी सर्व्हे नं.\':"",\'खसरा नंबर\':"", \'प्लॉट ची आराजी\':"",\"क्षेत्रफळ\":"" ,\"Building Name\":""}",
           "इतर माहिती: , इतर माहिती: मौजा नागपुर,तहसील व जिल्हा नागपुर,नागपुर महानगर पालिका व नागपुर सुधार प्रन्यासच्या हद्दीतील खास मौजा नागपुर येथील ख. क्र. 319/1,2,3,4 वर टाकलेल्या ले आउट व्यंकटेश नगर मधील भूखंड क्र. 11,12 व् 13,आराजी 2076.812 चौ. मी.,नगर भुमापन क्र. 101,शीट क्र. 248,वर बांधलेले बिल्डिंग क्र. ई-10 मधील 10 वर्ष पेक्षा जास्त जुने दुकान क्र.जीएस -9,बांधीव क्षेत्र 32.51 चौ. मी. सोबत अविभक्त 0.628%,कार्पोरेशन घर क्र. 1128/एफ/ई/10/जीएस/9+10,वार्ड क्र. 20(विभाग क. 1.57/248,दर रु. 66800/- प्र. चौ. मी.)  Extract the values of keys in this JSON format from the above given texts.\n        If you do not find a match, leave the value empty. Translate all numbers in English.\n        Do NOT send the wrong answer.Extract multiple occurrences of the keys, separated by commas.\n        Extract only the following keys in JSON format: { \'वार्ड नं.\':"", \'घर नं.\':"", \'प्लॉट नं.\':"",\'शिट नं.\':"", \'सिटी सर्व्हे नं.\':"",\'खसरा नंबर\':"", \'प्लॉट ची आराजी\':"",\"क्षेत्रफळ\":"" ,\"Building Name\":""}",
           "1706 GODHREJ ANANDAM WORLD CITY TOWER B SHEET NO.259,260,269,270,271  Extract the values of keys in this JSON format from the above given texts.\n        If you do not find a match, leave the value empty. Translate all numbers in English.\n        Do NOT send the wrong answer.Extract multiple occurrences of the keys, separated by commas.\n        Extract only the following keys in JSON format: { \'वार्ड नं.\':"", \'घर नं.\':"", \'प्लॉट नं.\':"",\'शिट नं.\':"", \'सिटी सर्व्हे नं.\':"",\'खसरा नंबर\':"", \'प्लॉट ची आराजी\':"",\"क्षेत्रफळ\":"" ,\"Building Name\":""}",
           "इतर माहिती: मौजा नागपूर वार्ड क्र. 20 ख.क्र. 617,618,620,621,622 येथील हसनबाग मधील ब्लॉक क्र. एल 1467 क्षेत्रफळ 72.90 चौ.मी. न.भु.क्र. 101  Extract the values of keys in this JSON format from the above given texts.\n        If you do not find a match, leave the value empty. Translate all numbers in English.\n        Do NOT send the wrong answer.Extract multiple occurrences of the keys, separated by commas.\n        Extract only the following keys in JSON format: { \'वार्ड नं.\':"", \'घर नं.\':"", \'प्लॉट नं.\':"",\'शिट नं.\':"", \'सिटी सर्व्हे नं.\':"",\'खसरा नंबर\':"", \'प्लॉट ची आराजी\':"",\"क्षेत्रफळ\":"" ,\"Building Name\":""}"
           "इतर माहिती: मौजा-नागपूर,वार्ड क्रं. 20,शिट क्रं. 280,सिटी सर्वे क्रं. 101,तह. व जि. नागपूर येथील खसरा क्रं. 615/2 मधील प्लॉट क्रंं. 427,आराजी 600 चौरस फुट(55.74 चौरस मीटर)आहे.  Extract the values of keys in this JSON format from the above given texts.\n        If you do not find a match, leave the value empty. Translate all numbers in English.\n        Do NOT send the wrong answer.Extract multiple occurrences of the keys, separated by commas.\n        Extract only the following keys in JSON format: { \'वार्ड नं.\':"", \'घर नं.\':"", \'प्लॉट नं.\':"",\'शिट नं.\':"", \'सिटी सर्व्हे नं.\':"",\'खसरा नंबर\':"", \'प्लॉट ची आराजी\':"",\"क्षेत्रफळ\":"" ,\"Building Name\":""}"
            ]
        self.INTEL :bool =None
        
    def model_tokenizer_intel(self):
        self.model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")
        self.tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")
        return None
    
    def model_tokenizer_nvidia(self):
        # Activate 4-bit precision base model loading
        use_4bit = True
        # Compute dtype for 4-bit base models
        bnb_4bit_compute_dtype = "float16"
        # Quantization type (fp4 or nf4)
        bnb_4bit_quant_type = "nf4"
        # Activate nested quantization for 4-bit base models (double quantization)
        use_double_nested_quant = False
        # Get the type
        compute_dtype = getattr(torch, bnb_4bit_compute_dtype)

        # BitsAndBytesConfig int-4 config
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=use_4bit,
            bnb_4bit_use_double_quant=use_double_nested_quant,
            bnb_4bit_quant_type=bnb_4bit_quant_type,
            bnb_4bit_compute_dtype=compute_dtype
        )
        device_map = {"": 0}
        model_id ="mistralai/Mistral-7B-Instruct-v0.2"

        model = AutoModelForCausalLM.from_pretrained(model_id, quantization_config=bnb_config, use_cache = False, device_map=device_map)
        model.config.pretraining_tp = 1

        # Load the tokenizer
        tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
        tokenizer.pad_token = tokenizer.eos_token
        tokenizer.padding_side = "right"
    
    def generate(self,message: str,max_new_tokens: int = 1024,temperature: float = 0.6,top_p: float = 0.9,top_k: int = 50,repetition_penalty: float = 1.2,) -> Iterator[str]:
        conversation = []
        conversation.append({"role": "user", "content": message})
        input_ids = self.tokenizer.apply_chat_template(conversation, return_tensors="pt")
        if input_ids.shape[1] > self.MAX_INPUT_TOKEN_LENGTH:
            input_ids = input_ids[:, -self.MAX_INPUT_TOKEN_LENGTH:]
            gr.Warning(f"Trimmed input from conversation as it was longer than {self.MAX_INPUT_TOKEN_LENGTH} tokens.")
        input_ids = input_ids.to(self.model.device)
        #print(input_ids)
        streamer = TextIteratorStreamer(self.tokenizer, timeout=20.0, skip_prompt=True, skip_special_tokens=True)
        generate_kwargs = dict(
            {"input_ids": input_ids},
            streamer=streamer,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            top_p=top_p,
            top_k=top_k,
            temperature=temperature,
            num_beams=1,
            repetition_penalty=repetition_penalty,
        )
        s=time.time()
        t = Thread(target=self.model.generate, kwargs=generate_kwargs)
        t.start()
        outputs = []
        for text in streamer:
            outputs.append(text)
        e=time.time()
        return outputs,len(input_ids[0]),e-s

    def score(self):
        data = []
        if self.INTEL:
             for i in self.prompts:
                 self.model_tokenizer_intel()
                 x,y,z = self.generate(i)
                 d = [y,z]
                data.append(d)
        else:
            for i in self.prompts:
                 self.model_tokenizer_nvidia()
                 x,y,z = self.generate(i)
                 d = [y,z]
                 data.append(d)
        return data






