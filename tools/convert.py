#!/usr/bin/env python3
import csv
import json
import sys
from pathlib import Path

BOOK_NAME_MAP = {
    "1 Mose": "1. Mose",
    "2 Mose": "2. Mose",
    "3 Mose": "3. Mose",
    "4 Mose": "4. Mose",
    "5 Mose": "5. Mose",
    "Josua": "Josua",
    "Richter": "Richter",
    "Rut": "Rut",
    "1 Samuel": "1. Samuel",
    "2 Samuel": "2. Samuel",
    "1 Koenige": "1. Könige",
    "2 Koenige": "2. Könige",
    "1 Chronik": "1. Chronik",
    "2 Chronik": "2. Chronik",
    "Esra": "Esra",
    "Nehemia": "Nehemia",
    "Ester": "Ester",
    "Job": "Hiob",
    "Psalm": "Psalm",
    "Sprueche": "Sprüche",
    "Prediger": "Prediger",
    "Hohelied": "Hohelied",
    "Jesaja": "Jesaja",
    "Jeremia": "Jeremia",
    "Klagelieder": "Klagelieder",
    "Hesekiel": "Hesekiel",
    "Daniel": "Daniel",
    "Hosea": "Hosea",
    "Joel": "Joel",
    "Amos": "Amos",
    "Obadja": "Obadja",
    "Jona": "Jona",
    "Mica": "Micha",
    "Nahum": "Nahum",
    "Habakuk": "Habakuk",
    "Zephanja": "Zefanja",
    "Haggai": "Haggai",
    "Sacharja": "Sacharja",
    "Maleachi": "Maleachi",
    "Matthaeus": "Matthäus",
    "Markus": "Markus",
    "Lukas": "Lukas",
    "Johannes": "Johannes",
    "Apostelgeschichte": "Apostelgeschichte",
    "Roemers": "Römer",
    "1 Korinther": "1. Korinther",
    "2 Korinther": "2. Korinther",
    "Galater": "Galater",
    "Epheser": "Epheser",
    "Philipper": "Philipper",
    "Kolosser": "Kolosser",
    "1 Thessalonicher": "1. Thessalonicher",
    "2 Thessalonicher": "2. Thessalonicher",
    "1 Timotheus": "1. Timotheus",
    "2 Timotheus": "2. Timotheus",
    "Titus": "Titus",
    "Philemon": "Philemon",
    "Hebraeer": "Hebräer",
    "Jakobus": "Jakobus",
    "1 Petrus": "1. Petrus",
    "2 Petrus": "2. Petrus",
    "1 Johannes": "1. Johannes",
    "2 Johannes": "2. Johannes",
    "3 Johannes": "3. Johannes",
    "Judas": "Judas",
    "Offenbarung": "Offenbarung",
}

def clean_text(text):
    return text.replace("¶ ", "").replace("¶", "").strip()

def convert(csv_path, json_path):
    books = {}
    book_order = []

    with open(csv_path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):
            if i < 6:
                continue
            break
        f.seek(0)
        for _ in range(6):
            next(f)

        reader = csv.reader(f)
        for row in reader:
            if len(row) < 6:
                continue
            _, book_csv, book_num_str, chapter_str, verse_str, text = row[:6]
            book_num = int(book_num_str)
            chapter = int(chapter_str)
            verse = int(verse_str)
            book_name = BOOK_NAME_MAP.get(book_csv, book_csv)
            testament = "AT" if book_num <= 39 else "NT"

            if book_num not in books:
                books[book_num] = {
                    "name": book_name,
                    "number": book_num,
                    "testament": testament,
                    "chapters": {},
                }
                book_order.append(book_num)

            chapters = books[book_num]["chapters"]
            if chapter not in chapters:
                chapters[chapter] = []
            chapters[chapter].append({"verse": verse, "text": clean_text(text)})

    result = {"books": []}
    for bn in sorted(book_order):
        b = books[bn]
        chapter_list = []
        for ch_num in sorted(b["chapters"]):
            chapter_list.append({"chapter": ch_num, "verses": b["chapters"][ch_num]})
        result["books"].append({
            "name": b["name"],
            "number": b["number"],
            "testament": b["testament"],
            "chapters": chapter_list,
        })

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False)

    total_verses = sum(
        len(v) for b in result["books"] for ch in b["chapters"] for v in [ch["verses"]]
    )
    print(f"Konvertiert: {len(result['books'])} Bücher, {total_verses} Verse → {json_path}")

if __name__ == "__main__":
    base = Path(__file__).resolve().parent.parent
    csv_path = base / "schlachter.csv"
    json_path = base / "data" / "bible.json"
    convert(csv_path, json_path)
