import numpy as np

from PIL import Image
import cv2

import torch

import ultralytics
from ultralytics import YOLO
from diffusers import StableDiffusionInpaintPipeline

model = YOLO('yolov8m-seg.pt')

img= cv2.imread('car.jpg')
image = cv2.resize(img,(640,384))

results = model.predict(source=img.copy(), save=True, save_txt=False, stream=True)

for result in results:
    # get array results
    masks = result.masks.data
    boxes = result.boxes.data
    # extract classes
    clss = boxes[:, 5]
    # get indices of results where class is 0 (people in COCO)
    car_indices = torch.where(clss == 2)
    # use these indices to extract the relevant masks
    car_masks = masks[car_indices]
    # scale for visualizing results
    car_mask = torch.any(car_masks, dim=0).int() * 255

    mask_image = car_mask.cpu().numpy()

image = Image.fromarray(image.astype('uint8'), 'RGB')
mask_image = Image.fromarray(cv2.bitwise_not(mask_image).astype('uint8'))

pipe = StableDiffusionInpaintPipeline.from_pretrained(
    "runwayml/stable-diffusion-inpainting",
    revision="fp16",
    torch_dtype=torch.float32,
)

prompt = str(input("Enter the prompt: ")) #"high resolution, car on beach"

out_image = pipe(prompt=prompt, image=image, mask_image=mask_image).images[0]

output_image = np.array(out_image)
output_image = cv2.resize(output_image,image.size)

cv2.imshow("Product Image",ouput_image)
cv2.waitkey(0)

