import requests
import json
import time

API_URL = 'https://metaforge.app/api/arc-raiders/items'
OUTPUT_FILE = "items.json"

LIMIT = 50
START_PAGE = 1
REQUEST_DELAY = 0.2  # seconds (avoid rate limits)


def fetch_page(page: int):
    response = requests.get(
        API_URL,
        params={
            "page": page,
            "limit": LIMIT,
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def main():
    all_items = []
    page = START_PAGE
    max_value = 0
    last_pagination = None

    print("🚀 Starting export...")

    while True:
        print(f"📄 Fetching page {page}...")
        payload = fetch_page(page)

        data = payload.get("data", [])
        pagination = payload.get("pagination", {})
        max_value = payload.get("maxValue", max_value)

        all_items.extend(data)
        last_pagination = pagination

        if not pagination.get("hasNextPage"):
            break

        page += 1
        time.sleep(REQUEST_DELAY)

    export = {
        "data": all_items,
        "maxValue": max_value,
        "pagination": {
            "page": 1,
            "limit": LIMIT,
            "total": len(all_items),
            "totalPages": last_pagination.get("totalPages"),
            "hasNextPage": False,
            "hasPrevPage": False,
        },
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(export, f, indent=2, ensure_ascii=False)

    print(f"✅ Export complete")
    print(f"📦 Items exported: {len(all_items)}")
    print(f"📝 Saved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
