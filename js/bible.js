const Bible = {
  data: null,
  flatVerses: [],

  async load() {
    const res = await fetch("data/bible.json");
    this.data = await res.json();
    this._buildFlatList();
  },

  _buildFlatList() {
    this.flatVerses = [];
    for (const book of this.data.books) {
      for (const ch of book.chapters) {
        for (const v of ch.verses) {
          this.flatVerses.push({
            book: book.name,
            bookNumber: book.number,
            testament: book.testament,
            chapter: ch.chapter,
            verse: v.verse,
            text: v.text,
          });
        }
      }
    }
  },

  getVerse(index) {
    return this.flatVerses[index];
  },

  getRandomIndex() {
    return Math.floor(Math.random() * this.flatVerses.length);
  },

  totalVerses() {
    return this.flatVerses.length;
  },

  getTestaments() {
    return ["AT", "NT"];
  },

  getBooks(testament) {
    return this.data.books.filter((b) => b.testament === testament);
  },

  getChapters(bookName) {
    const book = this.data.books.find((b) => b.name === bookName);
    return book ? book.chapters.map((c) => c.chapter) : [];
  },

  getVerseNumbers(bookName, chapter) {
    const book = this.data.books.find((b) => b.name === bookName);
    if (!book) return [];
    const ch = book.chapters.find((c) => c.chapter === chapter);
    return ch ? ch.verses.map((v) => v.verse) : [];
  },

  getBookNumber(bookName) {
    const book = this.data.books.find((b) => b.name === bookName);
    return book ? book.number : -1;
  },
};
