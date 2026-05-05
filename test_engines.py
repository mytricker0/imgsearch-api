from imgapi import image_search, random_image

print("=== image_search (bing+ddg default) ===")
results = image_search("cat", n=5)
for url in results:
    print(" ", url)

print("\n=== random_image ===")
print(random_image("sunset"))

print("\n=== bing only ===")
for url in image_search("dog", engines=["bing"], n=3):
    print(" ", url)

print("\n=== ddg only ===")
for url in image_search("dog", engines=["ddg"], n=3):
    print(" ", url)
