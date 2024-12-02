document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("closeBtn");
  const modalTitle = document.getElementById("modal-title");
  const modalCategories = document.getElementById("modal-categories");
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const closeBtnNav = document.getElementById("close-btn-nav");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;
  const searchInput = document.getElementById("search-input");
  const movieGrid = document.getElementById("movie-grid");
  const channelCount = document.getElementById("channel-count");
  const categoryFilter = document.getElementById("categoryFilter");
  const suggestionsList = document.getElementById("suggestions-list");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  closeBtnNav.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  fetch("channels.json")
    .then((response) => response.json())
    .then((data) => {
      const channels = data.channels;
      renderMovies(channels);
      updateChannelCount(channels.length);

      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const filteredChannels = filterChannels(channels, searchTerm, selectedCategory);
        renderMovies(filteredChannels);
        updateChannelCount(filteredChannels.length);
        showSuggestions(filteredChannels, searchTerm);
      });

      categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        const filteredChannels = filterChannels(channels, searchTerm, selectedCategory);
        renderMovies(filteredChannels);
        updateChannelCount(filteredChannels.length);
      });
    })
    .catch((error) => {
      console.error("Error loading channels data:", error);
    });

  function filterChannels(channels, searchTerm, selectedCategory) {
    return channels.filter((channel) => {
      const matchesSearchTerm = channel.name.toLowerCase().includes(searchTerm) ||
                                channel.categories.some(category => category.toLowerCase().includes(searchTerm));
      const matchesCategory = selectedCategory === "all" || channel.categories.map(c => c.toLowerCase()).includes(selectedCategory.toLowerCase());
      return matchesSearchTerm && matchesCategory;
    });
  }

  function renderMovies(channelsToRender) {
    movieGrid.innerHTML = "";
    channelsToRender.forEach((channel) => {
      const channelCard = document.createElement("div");
      channelCard.classList.add("movie-card");
      channelCard.innerHTML = `
        <img src="${channel.logo}" alt="${channel.name}">
        <div class="movie-details">
          <h3>${channel.name}</h3>
        </div>
        <div class="categories-stars">
          <h4>${channel.categories[0]}</h4>
        </div>
      `;

      const ratingElement = document.createElement("div");
      ratingElement.classList.add("rating");
      ratingElement.setAttribute("data-rating", 3);

      channelCard.querySelector(".categories-stars").appendChild(ratingElement);

      channelCard.addEventListener("click", () => {
        modal.classList.remove("hidden");
        modalTitle.textContent = `${channel.name}`;
        modalCategories.textContent = "Categories: ";
        const categoriesSpan = document.createElement("span");
        categoriesSpan.style.color = "#ec4899";
        categoriesSpan.textContent = channel.categories.join(", ");
        modalCategories.appendChild(categoriesSpan);
      });
      movieGrid.appendChild(channelCard);
    });
  }

  function updateChannelCount(count) {
    channelCount.textContent = `Results found: ${count}`;
  }

  function showSuggestions(filteredChannels, searchTerm) {
    suggestionsList.innerHTML = '';
    if (searchTerm.length > 0) {
      const filteredSuggestions = filteredChannels.slice(0, 5);
      filteredSuggestions.forEach((channel) => {
        const suggestionItem = document.createElement("li");
        suggestionItem.textContent = channel.name;
        suggestionItem.addEventListener("click", () => {
          searchInput.value = channel.name;
          suggestionsList.classList.add("hidden");
          renderMovies([channel]);
        });
        suggestionsList.appendChild(suggestionItem);
      });
      suggestionsList.classList.remove("hidden");
    } else {
      suggestionsList.classList.add("hidden");
    }
  }
});
