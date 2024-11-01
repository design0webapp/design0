import csv
import os
from enum import Enum

import tqdm
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
from tenacity import retry

load_dotenv()

OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")
print(OPENAI_BASE_URL, OPENAI_API_KEY, OPENAI_MODEL)

openai = OpenAI(
    base_url=OPENAI_BASE_URL,
    api_key=OPENAI_API_KEY,
)


class Category(Enum):
    RENDERS_3D = "3D Renders"
    ANIMALS = "Animals"
    ARCHITECTURE = "Architecture & Interiors"
    EXPERIMENTAL = "Experimental"
    FASHION = "Fashion & Beauty"
    FILM = "Film"
    FOOD = "Food & Drink"
    NATURE = "Nature"
    PEOPLE = "People"
    SPORTS = "Sports"
    TRAVEL = "Travel"


class ImageDescription(BaseModel):
    description: str
    category: Category


@retry
def img2description(_url: str):
    new_url = _url + "?fm=jpg&q=80&w=640&h=640&fit=max"
    completion = openai.beta.chat.completions.parse(
        model=OPENAI_MODEL,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe this image in detail, including the category it belongs to. The category should be one of the following: "
                        "'3D Renders', 'Animals', 'Architecture & Interiors', 'Experimental', 'Fashion & Beauty', 'Film', 'Food & Drink', 'Nature', 'People', 'Sports', 'Travel'",
                    },
                    {
                        "type": "image_url",
                        "image_url": new_url,
                    },
                ],
            }
        ],
        response_format=ImageDescription,
    )
    image_description = completion.choices[0].message.parsed
    # save as json
    with open("./dataset/jsons/" + id_ + ".json", "w") as f_out:
        f_out.write(image_description.model_dump_json())


existing_ids = set()
for filename in os.listdir("./dataset/jsons/"):
    if filename.endswith(".json"):
        existing_ids.add(filename.split(".")[0])

f = open("./dataset/photos.tsv")
f.readline()
reader = csv.reader(f, delimiter="\t")
for row in tqdm.tqdm(reader):
    id_ = row[0]
    if id_ in existing_ids:
        continue
    url = row[2]
    img2description(url)
