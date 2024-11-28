document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("closeBtn");
  const modalTitle = document.getElementById("modal-title");
  const modalCategories = document.getElementById("modal-categories");
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;
  const searchInput = document.getElementById("search-input");
  const movieGrid = document.getElementById("movie-grid");
  const channelCount = document.getElementById("channel-count");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
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
        const filteredChannels = channels.filter(
          (channel) =>
            channel.name.toLowerCase().includes(searchTerm) ||
            channel.categories.some((category) =>
              category.toLowerCase().includes(searchTerm)
            )
        );
        renderMovies(filteredChannels);
        updateChannelCount(filteredChannels.length);
      });
    })
    .catch((error) => {
      console.error("Error loading channels data:", error);
    });

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
            `;
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
});
