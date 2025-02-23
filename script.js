class DzongkhaFlashcards {
    constructor() {
      this.originalflashcards = flashcards;
      this.phoneticDefinitions = {
        aspiration: "Indicates whether the sound is pronounced with a strong burst of air.",
        voiced: "Indicates whether the vocal cords vibrate when pronouncing the letter.",
        place: "The point in the mouth where the sound is articulated (e.g., velar, dental, labial).",
        manner: "The way air flows when pronouncing the sound (e.g., plosive, nasal, fricative).",
        tone: "Indicates whether the sound has a high, low, or neutral pitch."
      };
      this.flashcards = [...this.originalflashcards];
      this.index = 0;
      this.userInput = "";
      this.feedback = "";
      this.levels = ["overview", "learning", "hint", "memory"];
      this.currentLevel = 0;
      this.setupModalClose();
      this.createShowAnswerButton();


    }

    shuffleFlashcards() {
        this.flashcards = [...this.originalflashcards];
        for (let i = this.flashcards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.flashcards[i], this.flashcards[j]] = [this.flashcards[j], this.flashcards[i]];
        }
      }

    setupModalClose() {
        const modal = document.getElementById("modal");
        modal.addEventListener("click", (event) => {
          if (event.target === modal) {
            this.closeModal();
          }
        });
      }

      openModal(letter, pronunciation) {
        const modal = document.getElementById("modal");
        let letterProperties = this.flashcards.find(card => card.dzongkha === letter);
        let phoneticProperties = Object.entries(letterProperties)
          .filter(([key]) => !["dzongkha", "pronunciation", "example", "group"].includes(key))
          .map(([key, value]) => `<strong title='${this.phoneticDefinitions[key] || ""}'>${key}:</strong> ${value}`)
          .join("<br>");
        
        document.getElementById("modal-content").innerHTML = `<strong style="font-size: 80px;">${letter}</strong><br>
        <span style="font-size: 24px;">${pronunciation}</span><br>
        <span style="font-size: 16px;">Example: ${letterProperties.example}</span><br><br>
        ${phoneticProperties}`;
        modal.style.display = "block";
        modal.classList.remove("hidden");
      }

  closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    modal.classList.add("hidden");
  }
  
    nextCard() {
      this.index = (this.index + 1) % this.flashcards.length;
      this.resetInput();
      this.render();
    }
  
    prevCard() {
      this.index = (this.index - 1 + this.flashcards.length) % this.flashcards.length;
      this.resetInput();
      this.render();
    }
  
    changeLevel() {
      this.currentLevel = (this.currentLevel + 1) % this.levels.length;
      if ((this.levels[this.currentLevel] === "memory") || (this.levels[this.currentLevel] === "hint")) {
        this.shuffleFlashcards();
      } else {
        this.flashcards = [...this.originalflashcards];
        }
      this.index = 0; // Reset index when changing levels
      this.render();
    }

    showAnswer() {
        const currentCard = this.flashcards[this.index];
        document.getElementById("feedback").innerText = `Answer: ${currentCard.pronunciation}`;
      }

      createShowAnswerButton() {
        this.showAnswerButton = document.createElement("button");
        this.showAnswerButton.innerText = "Show Answer";
        this.showAnswerButton.onclick = () => this.showAnswer();
        
        const inputContainer = document.querySelector(".input-container");
        if (inputContainer) {
          inputContainer.appendChild(this.showAnswerButton);
        }
        
        this.updateShowAnswerButton();
      }
      
      updateShowAnswerButton() {
        if (this.levels[this.currentLevel] === "hint" || this.levels[this.currentLevel] === "memory") {
          this.showAnswerButton.style.display = "inline-block";
        } else {
          this.showAnswerButton.style.display = "none";
        }
      }
  
    resetInput() {
      this.userInput = "";
      this.feedback = "";
    }
  
    checkAnswer() {
      if (this.currentLevel > 1) { // Disable checking in overview and learning modes
        if (this.userInput.trim().toLowerCase() === this.flashcards[this.index].pronunciation.toLowerCase()) {
          this.feedback = "✅ Correct!";
        } else {
          this.feedback = "❌ Try again.";
        }
      }
    }
  
    renderOverview() {
      const container = document.getElementById("overview");
      container.innerHTML = `<h2>Dzongkha Alphabet Overview</h2>`;
      let grouped = {};
      
      this.flashcards.forEach(card => {
        if (!grouped[card.group]) grouped[card.group] = [];
        grouped[card.group].push(card);
      });
  
      Object.keys(grouped).forEach(group => {
        const section = document.createElement("div");
        section.innerHTML = `<h3>${group}s</h3>`;
        const grid = document.createElement("div");
        grid.className = "grid";
        
        let row;
        grouped[group].forEach((card, index) => {
          if (index % 6 === 0) { // Start new row every 4 items
            row = document.createElement("div");
            row.className = "grid-row";
            grid.appendChild(row);
          }
          const item = document.createElement("div");
          item.className = "grid-item";
          item.innerHTML = `<strong>${card.dzongkha}</strong><br>${card.pronunciation}`;
          item.onclick = () => this.openModal(card.dzongkha, card.pronunciation);
          row.appendChild(item);
        });
        section.appendChild(grid);
        container.appendChild(section);
      });
    }
  
    render() {
      document.getElementById("levelDisplay").innerText = "Level: " + this.levels[this.currentLevel];
      let letterProperties = this.flashcards[this.index];
      let phoneticProperties = Object.entries(letterProperties)
      .filter(([key]) => !["dzongkha", "pronunciation", "example", "group"].includes(key))
      .map(([key, value]) => `<strong title='${this.phoneticDefinitions[key] || ""}'>${key}:</strong> ${value}`)
      .join("<br>");

      if (this.currentLevel === 0) {
        document.getElementById("flashcard-container").classList.add("hidden");
        document.getElementById("overview").classList.remove("hidden");
        this.renderOverview();
      } else {
        document.getElementById("flashcard-container").classList.remove("hidden");
        document.getElementById("overview").classList.add("hidden");
        document.getElementById("flashcard").innerText = this.flashcards[this.index].dzongkha;
        document.getElementById("userInput").value = "";
        document.getElementById("feedback").innerText = this.feedback;
        
        if (this.currentLevel === 1) {
          document.getElementById("hint").innerHTML = "Pronunciation: " + this.flashcards[this.index].pronunciation + "<br>" +
          "Like in: " + this.flashcards[this.index].example + "<br>" +
          phoneticProperties;
          document.getElementById("userInput").classList.add("hidden");
          document.getElementById("check").classList.add("hidden");
        } else if (this.currentLevel === 2) {
          document.getElementById("hint").innerHTML = "Group: " + this.flashcards[this.index].group + "<br>" +
          phoneticProperties;;
          document.getElementById("userInput").classList.remove("hidden");
          document.getElementById("check").classList.remove("hidden");
        } else {
          document.getElementById("hint").innerText = "";
          document.getElementById("userInput").classList.remove("hidden");
          document.getElementById("check").classList.remove("hidden");
        }
      }
      this.updateShowAnswerButton();
    }
  }
  
  const app = new DzongkhaFlashcards();
  
  // Initialize UI elements
  window.onload = function () {
    document.getElementById("prev").addEventListener("click", () => app.prevCard());
    document.getElementById("next").addEventListener("click", () => app.nextCard());
    document.getElementById("check").addEventListener("click", () => {
      app.userInput = document.getElementById("userInput").value;
      app.checkAnswer();
      app.render();
    });
    document.getElementById("changeLevel").addEventListener("click", () => app.changeLevel());

    app.render();
  };