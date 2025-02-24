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
      this.activeGroups = new Set(["consonant", "vowel", "number"]);
      this.flashcards = [...this.originalflashcards];
      this.index = 0;
      this.userInput = "";
      this.feedback = "";
      this.levels = ["overview", "learning", "hint", "memory"];
      this.currentLevel = 0;
      this.setupModalClose();
      this.createShowAnswerButton();
      this.createFilterButtons();

    }

    playAudio(audiopath) {

        if (audiopath) {
            let audio = new Audio(audiopath);
            audio.volume = 0.5;
            audio.play();
        }
    }

    adjustFontSize() {
        const gridItems = document.querySelectorAll(".grid-item span");
        gridItems.forEach(span => {
          if (span.textContent.length > 7) {
            let fontSize = 24;
            fontSize -=  2;
            span.style.fontSize = fontSize + "px";
          }
        });
      }

    createFilterButtons() {
        const filterContainer = document.createElement("div");
        filterContainer.id = "filter-container";
        let filterTitle = document.createElement("h2");
        filterTitle.innerText = "Filter by Group";
        filterContainer.appendChild(filterTitle);
        
        ["consonant", "vowel", "number"].forEach(group => {
          const button = document.createElement("button");
          button.innerText = group.charAt(0).toUpperCase() + group.slice(1);
          button.dataset.group = group;
          button.classList.add("filter-button", "active");
          button.onclick = () => this.toggleGroup(group, button);
          filterContainer.appendChild(button);
        });
        document.body.insertBefore(filterContainer, document.getElementById("flashcard-container"));
    }

    toggleGroup(group, button) {
        if (this.activeGroups.has(group)) {
          this.activeGroups.delete(group);
          button.classList.remove("active");
          button.style.backgroundColor = "#ccc"; // Inactive state
        } else {
          this.activeGroups.add(group);
          button.classList.add("active");
          button.style.backgroundColor = "#007bff"; // Active state (blue)
        }
        this.filterFlashcards();
      }
 
      updateFlashcard() {
        if (this.flashcards.length === 0) {
          document.getElementById("flashcard").innerText = "?";
          document.getElementById("hint").innerText = "";
        } else {
          const currentCard = this.flashcards[this.index];
          document.getElementById("flashcard").innerText = currentCard.dzongkha;
          this.renderHint(this);
        }
      }
      
      filterFlashcards() {
        this.flashcards = this.originalflashcards.filter(card => this.activeGroups.has(card.group));
        this.index = 0;
    
        // Shuffle only if in "memory" mode
        if ((this.levels[this.currentLevel] === "memory") || (this.levels[this.currentLevel] === "hint")) {
            this.shuffleFlashcards();
        }
    
        this.updateFlashcard();
    }
    
    // Fisher-Yates Shuffle Algorithm
    shuffleFlashcards() {
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
      renderHint(app) {
        const currentCard = this.flashcards[this.index];
        let letter = currentCard.dzongkha;
        document.getElementById("hint").innerText = `Hint: ${currentCard.group}`;
        let letterProperties = this.flashcards.find(card => card.dzongkha === letter);
        let phoneticProperties = Object.entries(letterProperties)
          .filter(([key]) => !["dzongkha", "pronunciation", "example", "group", "meaning", "audio"].includes(key))
          .map(([key, value]) => `
            <span class="tooltip-container" onclick="app.showTooltip(event, '${key}')">
              <strong>${key}:</strong> ${value}
              <span class="tooltip">${this.phoneticDefinitions[key] || ""}</span>
            </span>`)
          .join("<br>");
          if (this.currentLevel > 0) {
            document.getElementById("hint").innerHTML = "Group: " + this.flashcards[this.index].group + "<br><br>" +
            phoneticProperties;
          }
          if (this.currentLevel === 1) {
            document.getElementById("hint").innerHTML = "Pronunciation: " + this.flashcards[this.index].pronunciation + "<br><br>";
            if (this.flashcards[this.index].example !== undefined) {
              document.getElementById("hint").innerHTML += "Like in: " + this.flashcards[this.index].example + "<br><br>";
            }
            if (this.flashcards[this.index].meaning !== undefined) {
              document.getElementById("hint").innerHTML += "Meaning: " + this.flashcards[this.index].meaning + "<br><br>";
            }
              document.getElementById("hint").innerHTML += phoneticProperties;
            document.getElementById("userInput").classList.add("hidden");
            document.getElementById("check").classList.add("hidden");
          } else if (this.currentLevel === 2) {
            document.getElementById("hint").innerHTML = "Group: " + this.flashcards[this.index].group + "<br><br>" +
            phoneticProperties;;
            document.getElementById("userInput").classList.remove("hidden");
            document.getElementById("check").classList.remove("hidden");
          } else {
            document.getElementById("hint").innerText = "";
            document.getElementById("userInput").classList.remove("hidden");
            document.getElementById("check").classList.remove("hidden");
          }
        }
      openModal(letter, pronunciation) {
        const modal = document.getElementById("modal");
        let letterProperties = this.flashcards.find(card => card.dzongkha === letter);
        let phoneticProperties = Object.entries(letterProperties)
          .filter(([key]) => !["dzongkha", "pronunciation", "example", "group", "meaning", "audio"].includes(key))
          .map(([key, value]) => `
            <span class="tooltip-container" onclick="app.showTooltip(event, '${key}')">
              <strong>${key}:</strong> ${value}
              <span class="tooltip">${this.phoneticDefinitions[key] || ""}</span>
            </span>`)
          .join("<br>");
        
        document.getElementById("modal-content").innerHTML = `
          <strong style="font-size: 80px;">${letter}</strong><br>
          <span style="font-size: 24px;">${pronunciation}</span><br>`;
        if (letterProperties.example !== undefined) {

            document.getElementById("modal-content").innerHTML += `
          <span style="font-size: 16px;">Like in: ${letterProperties.example}</span>`;
        }
        if (letterProperties.meaning !== undefined) {
          document.getElementById("modal-content").innerHTML += `
          <span style="font-size: 16px;">Meaning: ${letterProperties.meaning}</span>`;
        }
        document.getElementById("modal-content").innerHTML += `<br><br>
          ${phoneticProperties}`;
        if (letterProperties.audio) {
            document.getElementById("modal-content").innerHTML += `<br><br>
            <button class='audio-btn' onclick='app.playAudio("${letterProperties.audio}")'>🔊</button>`;
        }
        
        modal.style.display = "block";
        modal.classList.remove("hidden");
      }
      
      showTooltip(event, key) {
        // Hide any existing tooltips
        document.querySelectorAll(".tooltip").forEach(t => t.classList.remove("visible"));
      
        // Show the clicked tooltip
        const tooltip = event.target.querySelector(".tooltip");
        if (tooltip) {
          tooltip.classList.add("visible");
        }
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
        if (this.userInput)
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
        if (group === "number") {
            let credit_text = "For a good video guide on how to speak numbers in Dzongkha, check out <a href='https://www.youtube.com/watch?v=OmWsdhU1eew' target='_blank'>How to count in Dzongkha (Bhutanese)</a>. Audio credit: JamJam";
            section.innerHTML += `<p>${credit_text}</p>`;
        }
        const grid = document.createElement("div");
        grid.className = "grid";
        
        let row;
        grouped[group].forEach((card, index) => {

          const item = document.createElement("div");
          item.className = "grid-item";
          item.innerHTML = `<span class="dzongkha"><strong>${card.dzongkha}</strong></span><span class="strong">${card.pronunciation}</span>`;
          if (card.meaning !== undefined) {
            item.innerHTML += `<em>${card.meaning}</em>`;
          }
          item.onclick = () => this.openModal(card.dzongkha, card.pronunciation);
          grid.appendChild(item);
        });
        section.appendChild(grid);
        container.appendChild(section);
      });
    }
  
    render() {
      document.getElementById("levelDisplay").innerText = "Level: " + this.levels[this.currentLevel];
      let letterProperties = this.flashcards[this.index];
      let phoneticProperties = Object.entries(letterProperties)
      .filter(([key]) => !["dzongkha", "pronunciation", "example", "group", "meaning", "audio"].includes(key))
      .map(([key, value]) => `
        <span class="tooltip-container" onclick="app.showTooltip(event, '${key}')">
          <strong>${key}:</strong> ${value}
          <span class="tooltip">${this.phoneticDefinitions[key] || ""}</span>
        </span>`)
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
          document.getElementById("hint").innerHTML = "Pronunciation: " + this.flashcards[this.index].pronunciation + "<br><br>";
          if (this.flashcards[this.index].example !== undefined) {
            document.getElementById("hint").innerHTML += "Like in: " + this.flashcards[this.index].example + "<br><br>";
          }
          if (this.flashcards[this.index].meaning !== undefined) {
            document.getElementById("hint").innerHTML += "Meaning: " + this.flashcards[this.index].meaning + "<br><br>";
          }
            document.getElementById("hint").innerHTML += phoneticProperties;
          document.getElementById("userInput").classList.add("hidden");
          document.getElementById("check").classList.add("hidden");
        } else if (this.currentLevel === 2) {
          document.getElementById("hint").innerHTML = "Group: " + this.flashcards[this.index].group + "<br><br>" +
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
    // Hide tooltips when clicking elsewhere
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".tooltip-container")) {
        document.querySelectorAll(".tooltip").forEach(t => t.classList.remove("visible"));
        }
    });

    app.render();
    app.adjustFontSize();
  };