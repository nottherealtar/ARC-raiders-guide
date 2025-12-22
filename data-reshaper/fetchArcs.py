import requests
import json
import time

API_URL = 'https://metaforge.app/api/arc-raiders/arcs?includeLoot=true'
OUTPUT_FILE = "arcs.json"

LIMIT = 50
START_PAGE = 1
REQUEST_DELAY = 0.2  # seconds (avoid rate limits)


def fetch_page(page: int):
    """Fetch a single page of ARCs data from the API"""
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
    all_arcs = []
    page = START_PAGE
    last_pagination = None

    print("🚀 Starting ARC data export...")

    while True:
        print(f"📄 Fetching page {page}...")
        payload = fetch_page(page)

        data = payload.get("data", [])
        pagination = payload.get("pagination", {})

        all_arcs.extend(data)
        last_pagination = pagination

        print(f"   ✓ Fetched {len(data)} ARCs (Total: {len(all_arcs)})")

        # Check if there are more pages
        if not pagination.get("hasNextPage"):
            break

        page += 1
        time.sleep(REQUEST_DELAY)

    # Create final export structure
    export = {
        "data": all_arcs,
        "pagination": {
            "page": 1,
            "limit": len(all_arcs),
            "total": len(all_arcs),
            "totalPages": 1,
            "hasNextPage": False,
            "hasPrevPage": False,
        },
    }

    # Write to JSON file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(export, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Export complete!")
    print(f"📦 ARCs exported: {len(all_arcs)}")
    print(f"📝 Saved to: {OUTPUT_FILE}")

    # Print summary of ARCs
    print(f"\n📊 Summary:")
    for arc in all_arcs:
        loot_count = len(arc.get("loot", []))
        print(f"   • {arc['name']} ({arc['id']}) - {loot_count} loot items")


if __name__ == "__main__":
    main()
