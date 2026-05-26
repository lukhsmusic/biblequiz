const App = {
  mode: null, // "random" | "daily"
  currentVerse: null,
  dailyIndices: [],
  dailyPos: 0,

  async init() {
    await Bible.load();
    this.bindEvents();
    this.showScreen("start");
    this.restoreDailyProgress();
  },

  bindEvents() {
    document.getElementById("btn-random").addEventListener("click", () => {
      this.mode = "random";
      this.nextVerse();
    });
    document.getElementById("btn-daily").addEventListener("click", () => {
      this.mode = "daily";
      this.dailyIndices = dailyList(Bible.totalVerses(), 100);
      this.restoreDailyProgress();
      this.nextVerse();
    });
    document.getElementById("btn-guess").addEventListener("click", () => {
      this.showScreen("guess");
      this.initDropdowns();
    });
    document.getElementById("btn-submit").addEventListener("click", () => {
      this.submitGuess();
    });
    document.getElementById("btn-next").addEventListener("click", () => {
      this.nextVerse();
    });
    document.getElementById("btn-back").addEventListener("click", () => {
      this.showScreen("start");
    });
    document.getElementById("btn-back-result").addEventListener("click", () => {
      this.showScreen("start");
    });

    document.getElementById("sel-verse").addEventListener("change", () => {
      document.getElementById("btn-submit").disabled =
        !document.getElementById("sel-verse").value;
    });

    document
      .getElementById("sel-testament")
      .addEventListener("change", (e) => {
        this.onTestamentChange(e.target.value);
      });
    document.getElementById("sel-book").addEventListener("change", (e) => {
      this.onBookChange(e.target.value);
    });
    document.getElementById("sel-chapter").addEventListener("change", (e) => {
      this.onChapterChange(e.target.value);
    });
  },

  showScreen(name) {
    document.querySelectorAll(".screen").forEach((el) => {
      el.classList.toggle("active", el.id === "screen-" + name);
    });
  },

  nextVerse() {
    if (this.mode === "daily") {
      if (this.dailyPos >= this.dailyIndices.length) {
        this.dailyPos = 0;
      }
      this.currentVerse = Bible.getVerse(this.dailyIndices[this.dailyPos]);
      this.dailyPos++;
      this.saveDailyProgress();
      document.getElementById("daily-progress").textContent =
        this.dailyPos + " / " + this.dailyIndices.length;
      document.getElementById("daily-progress").style.display = "block";
    } else {
      this.currentVerse = Bible.getVerse(Bible.getRandomIndex());
      document.getElementById("daily-progress").style.display = "none";
    }
    document.getElementById("verse-text").textContent =
      this.currentVerse.text;
    this.showScreen("verse");
  },

  initDropdowns() {
    const selT = document.getElementById("sel-testament");
    const selB = document.getElementById("sel-book");
    const selC = document.getElementById("sel-chapter");
    const selV = document.getElementById("sel-verse");

    selT.innerHTML = '<option value="">-- Testament --</option>';
    Bible.getTestaments().forEach((t) => {
      const label = t === "AT" ? "Altes Testament" : "Neues Testament";
      selT.innerHTML += `<option value="${t}">${label}</option>`;
    });
    selB.innerHTML = '<option value="">-- Buch --</option>';
    selB.disabled = true;
    selC.innerHTML = '<option value="">-- Kapitel --</option>';
    selC.disabled = true;
    selV.innerHTML = '<option value="">-- Vers --</option>';
    selV.disabled = true;
    document.getElementById("btn-submit").disabled = true;
  },

  onTestamentChange(testament) {
    const selB = document.getElementById("sel-book");
    const selC = document.getElementById("sel-chapter");
    const selV = document.getElementById("sel-verse");

    selB.innerHTML = '<option value="">-- Buch --</option>';
    if (testament) {
      Bible.getBooks(testament).forEach((b) => {
        selB.innerHTML += `<option value="${b.name}">${b.name}</option>`;
      });
      selB.disabled = false;
    } else {
      selB.disabled = true;
    }
    selC.innerHTML = '<option value="">-- Kapitel --</option>';
    selC.disabled = true;
    selV.innerHTML = '<option value="">-- Vers --</option>';
    selV.disabled = true;
    document.getElementById("btn-submit").disabled = true;
  },

  onBookChange(bookName) {
    const selC = document.getElementById("sel-chapter");
    const selV = document.getElementById("sel-verse");

    selC.innerHTML = '<option value="">-- Kapitel --</option>';
    if (bookName) {
      Bible.getChapters(bookName).forEach((ch) => {
        selC.innerHTML += `<option value="${ch}">${ch}</option>`;
      });
      selC.disabled = false;
    } else {
      selC.disabled = true;
    }
    selV.innerHTML = '<option value="">-- Vers --</option>';
    selV.disabled = true;
    document.getElementById("btn-submit").disabled = true;
  },

  onChapterChange(chapter) {
    const selV = document.getElementById("sel-verse");
    const selB = document.getElementById("sel-book");

    selV.innerHTML = '<option value="">-- Vers --</option>';
    if (chapter) {
      Bible.getVerseNumbers(selB.value, parseInt(chapter)).forEach((v) => {
        selV.innerHTML += `<option value="${v}">${v}</option>`;
      });
      selV.disabled = false;
    } else {
      selV.disabled = true;
    }
    document.getElementById("btn-submit").disabled = true;
  },

  submitGuess() {
    const guessBook = document.getElementById("sel-book").value;
    const guessChapter = parseInt(document.getElementById("sel-chapter").value);
    const guessVerse = parseInt(document.getElementById("sel-verse").value);

    const correct = this.currentVerse;
    const guessBookNum = Bible.getBookNumber(guessBook);

    const bookDiff = Math.abs(guessBookNum - correct.bookNumber);
    const chapterDiff = Math.abs(guessChapter - correct.chapter);
    const verseDiff = Math.abs(guessVerse - correct.verse);

    const ref = `${correct.book} ${correct.chapter},${correct.verse}`;
    document.getElementById("result-reference").textContent = ref;
    document.getElementById("result-verse-text").textContent = correct.text;

    const resultDetails = document.getElementById("result-details");
    resultDetails.innerHTML = "";

    const addRow = (label, guessVal, correctVal, diff) => {
      const row = document.createElement("div");
      row.className = "result-row" + (diff === 0 ? " correct" : " wrong");
      if (diff === 0) {
        row.textContent = `${label}: ${correctVal} — Richtig!`;
      } else {
        row.textContent = `${label}: ${guessVal} (richtig: ${correctVal}, ${diff} daneben)`;
      }
      resultDetails.appendChild(row);
    };

    addRow("Buch", guessBook, correct.book, bookDiff);
    addRow("Kapitel", guessChapter, correct.chapter, chapterDiff);
    addRow("Vers", guessVerse, correct.verse, verseDiff);

    if (bookDiff === 0 && chapterDiff === 0 && verseDiff === 0) {
      document.getElementById("result-summary").textContent =
        "Perfekt! Genau richtig!";
      document.getElementById("result-summary").className = "summary perfect";
    } else if (bookDiff === 0) {
      document.getElementById("result-summary").textContent =
        "Richtiges Buch!";
      document.getElementById("result-summary").className = "summary close";
    } else {
      document.getElementById("result-summary").textContent = "";
      document.getElementById("result-summary").className = "summary";
    }

    this.showScreen("result");
  },

  saveDailyProgress() {
    const key = "bq-daily-" + dateSeed();
    localStorage.setItem(key, this.dailyPos.toString());
  },

  restoreDailyProgress() {
    const key = "bq-daily-" + dateSeed();
    const saved = localStorage.getItem(key);
    if (saved !== null && this.mode === "daily") {
      this.dailyPos = parseInt(saved) || 0;
    }
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
