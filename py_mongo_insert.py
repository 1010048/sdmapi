import requests
import time
from py_mongo_get_database import get_database

# Get the database
dbname = get_database()
collection_name = dbname["sdapi_collection"]

# Get current time
current_timestamp = int(time.time())
print(current_timestamp)

# Define the web service URLs and their corresponding prefixes
urls = [
    ("https://www.cm-fornosdealgodres.pt/wp-json/custom/v1/posts", "FOR"),
    ("https://www.cm-almeida.pt/wp-json/custom/v1/posts", "ALM"),
    ("https://www.cm-meda.pt/wp-json/custom/v1/posts", "MDA"),
    ("https://www.cm-trancoso.pt/wp-json/custom/v1/posts", "TRC"),
    ("https://www.cm-belmonte.pt/wp-json/custom/v1/posts", "BEL"),
    ("https://www.cm-celoricodabeira.pt/wp-json/custom/v1/posts", "CLB")
]

# Iterate over the URLs and fetch data from each web service
for url, prefix in urls:
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Skipping URL: {url}")
        continue

    data = response.json()

    # Iterate over the data and update or insert into the database
    for item in data:
        _id = f"{prefix}_{int(item['id'])}"
        existing_item = collection_name.find_one({"_id": _id})

        if existing_item:
            update_date = existing_item.get("update_date")
            if update_date and update_date < item["update_date"]:
                # Update the existing item
                collection_name.update_one(
                    {"_id": _id},
                    {"$set": {
                        "item_name": item["title"],
                        "county": item["countie"],
                        "category": item["category"],
                        "date": item["date"],
                        "publish_date": item["publish_date"],
                        "update_date": item["update_date"],
                        "link": item["link"],
                        "image": item["image"],
                        "author": item["author"],
                        "excerpt": item["excerpt"]
                    }}
                )
        else:
            # Insert the new item
            post = {
                "_id": _id,
                "item_name": item["title"],
                "county": item["countie"],
                "category": item["category"],
                "date": item["date"],
                "publish_date": item["publish_date"],
                "update_date": item["update_date"],
                "link": item["link"],
                "image": item["image"],
                "author": item["author"],
                "excerpt": item["excerpt"]
            }
            collection_name.insert_one(post)
